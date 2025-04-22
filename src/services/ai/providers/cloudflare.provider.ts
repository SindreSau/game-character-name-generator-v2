// 'use server'; // Removed - This file exports a class, not Server Actions

import {
  IAIProvider,
  AIProviderRequestParams,
  AIProviderResponse,
} from './../types';

// Type definitions specific to Cloudflare API
type CloudflareAIMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

type CloudflareAIAPIResult = {
  result: {
    response: string;
    [key: string]: unknown;
  };
  success: boolean;
  errors: string[];
  messages: string[];
};

export class CloudflareProvider implements IAIProvider {
  private readonly accountId: string;
  private readonly apiToken: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;

    if (!this.accountId || !this.apiToken) {
      // This error will be thrown if *either* is missing or empty
      throw new Error(
        'Cloudflare Account ID or API Token not configured in environment variables.'
      );
    }
  }

  private calculateTemperature(complexity: number = 3): number {
    const k = 1.14; // Steepness
    const x0 = 3; // Midpoint
    const sigmoidValue = 1 / (1 + Math.exp(-k * (complexity - x0)));
    const mappedValue = 0.3 + sigmoidValue * 0.7; // Map sigmoid (0-1) to temp range (0.3-1.0)
    return Math.round(mappedValue * 100) / 100;
  }

  private async callApi(
    model: string,
    messages: CloudflareAIMessage[],
    temperature: number
  ): Promise<CloudflareAIAPIResult> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`;
    const body = JSON.stringify({
      messages,
      temperature,
      raw: true, // Request raw text response for easier parsing initially
      top_p: 0.99,
      top_k: 50,
    });

    console.log(`Calling Cloudflare API: ${url} with model ${model}`);
    // console.log('Cloudflare Request Body:', body);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cloudflare API Error (${response.status}): ${errorText}`);
      throw new Error(
        `Cloudflare API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    // console.log('Cloudflare Raw Response:', result);
    return result;
  }

  private parseResponse(
    apiResult: CloudflareAIAPIResult,
    requestedCount: number
  ): { names: string[]; message: string } {
    let responseText = apiResult.result?.response?.trim() || '';
    let names: string[] = [];
    let message = 'Failed to parse response.';

    // Attempt 1: Strict JSON parsing
    try {
      // Basic cleanup: Add closing brace if looks like JSON object start
      if (responseText.startsWith('{') && !responseText.endsWith('}')) {
        responseText += '}';
      }
      // Basic cleanup: Remove potential markdown code block fences
      responseText = responseText
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '');

      const parsed = JSON.parse(responseText);
      if (Array.isArray(parsed.names)) {
        names = parsed.names.map(String).slice(0, requestedCount);
        message = `Parsed ${names.length} names successfully via JSON.`;
        return { names, message };
      } else if (Array.isArray(parsed)) {
        // Handle case where it returns just an array
        names = parsed.map(String).slice(0, requestedCount);
        message = `Parsed ${names.length} names successfully from direct array.`;
        return { names, message };
      }
    } catch {
      console.warn(
        'Cloudflare: Initial JSON parse failed. Trying regex fallback.'
      );
      // console.warn('Failed JSON:', responseText);
    }

    // Attempt 2: Regex extraction (more robust)
    try {
      // Regex to find strings within a "names": [...] structure or just [...] structure
      const nameExtractor =
        /(?:"names"\s*:\s*\[\s*|^\[\s*)(?:"(.*?)")(?:\s*,\s*"(.*?)")*/g;
      const matches = [...responseText.matchAll(nameExtractor)];

      if (matches.length > 0) {
        names = matches
          .flatMap((match) => match.slice(1).filter(Boolean))
          .map(String)
          .slice(0, requestedCount);
        if (names.length > 0) {
          message = `Extracted ${names.length} names via primary regex.`;
          return { names, message };
        }
      }

      // Attempt 3: Simpler regex for quoted strings as last resort
      const simpleQuotes = responseText.match(/"([^"]+)"/g);
      if (simpleQuotes) {
        names = simpleQuotes
          .map((q) => q.slice(1, -1))
          .filter((name) => name && name.toLowerCase() !== 'names') // Filter out the key "names"
          .slice(0, requestedCount);
        if (names.length > 0) {
          message = `Extracted ${names.length} names via simple quote regex.`;
          return { names, message };
        }
      }
    } catch (regexError) {
      console.error('Cloudflare: Regex parsing failed:', regexError);
    }

    console.error(
      'Cloudflare: Failed to extract names from response:',
      responseText
    );
    return { names: [], message }; // Return empty if all parsing fails
  }

  async generate(params: AIProviderRequestParams): Promise<AIProviderResponse> {
    const { model, systemPrompt, userPrompt, complexity, count = 5 } = params;

    const messages: CloudflareAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const temperature = this.calculateTemperature(complexity);

    try {
      const apiResult = await this.callApi(model, messages, temperature);

      if (!apiResult.success) {
        console.error('Cloudflare API indicated failure:', apiResult.errors);
        return {
          success: false,
          message: `Cloudflare API error: ${
            apiResult.errors?.join(', ') || 'Unknown API error'
          }`,
          names: [],
          providerInfo: {
            provider: 'Cloudflare',
            model,
            rawResponse: apiResult,
          },
        };
      }

      const { names, message: parseMessage } = this.parseResponse(
        apiResult,
        count
      );

      if (names.length > 0) {
        return {
          success: true,
          message: parseMessage,
          names: names,
          providerInfo: {
            provider: 'Cloudflare',
            model,
            rawResponse: apiResult,
          },
        };
      } else {
        // Parsing failed
        return {
          success: false,
          message: `Cloudflare: ${parseMessage}`, // Report parsing failure reason
          names: [],
          providerInfo: {
            provider: 'Cloudflare',
            model,
            rawResponse: apiResult,
          },
        };
      }
    } catch (error) {
      console.error('Error generating names with Cloudflare:', error);
      return {
        success: false,
        message: `Cloudflare provider error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        names: [],
        providerInfo: { provider: 'Cloudflare', model }, // Avoid including rawResponse on general catch
      };
    }
  }
}
