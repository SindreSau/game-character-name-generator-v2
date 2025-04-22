// This file will contain the Gemini provider implementation
// We will move the logic from src/actions/ai-endpoint-functions/gemini.server.ts here

import {
  IAIProvider,
  AIProviderRequestParams,
  AIProviderResponse,
} from './../types';

// Type definitions specific to Gemini API (can be expanded)
type GeminiPart = {
  text?: string;
  // Add other part types if needed, e.g., functionCall
};

type GeminiContent = {
  parts: GeminiPart[];
  role?: string; // Optional role
};

type GeminiGenerationConfig = {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: Record<string, any>; // Define more strictly if possible
};

type GeminiAPIRequestBody = {
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  // Add safetySettings etc. if needed
};

type GeminiAPIResponse = {
  candidates?: {
    content?: {
      parts?: GeminiPart[];
    };
    // Add finishReason, safetyRatings etc. if needed
  }[];
  // Add promptFeedback etc. if needed
  error?: {
    code: number;
    message: string;
    status: string;
  };
};

export class GeminiProvider implements IAIProvider {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_TOKEN!;
    if (!this.apiKey) {
      throw new Error(
        'GEMINI_API_TOKEN not configured in environment variables.'
      );
    }
  }

  // Helper to calculate temperature (optional, could be simpler)
  private calculateTemperature(complexity: number = 3): number {
    // Simple mapping for now, adjust as needed
    const tempMap = [0.1, 0.2, 0.4, 0.7, 1.0]; // Index corresponds to complexity 1-5
    const index = Math.max(0, Math.min(4, Math.round(complexity) - 1));
    return tempMap[index];
  }

  private async callApi(
    model: string,
    contents: GeminiContent[],
    generationConfig: GeminiGenerationConfig
  ): Promise<GeminiAPIResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const body: GeminiAPIRequestBody = {
      contents,
      generationConfig,
    };

    console.log(`Calling Gemini API: ${url} with model ${model}`);
    // console.log('Gemini Request Body:', JSON.stringify(body, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    // console.log('Gemini Raw Response:', JSON.stringify(result, null, 2));

    if (!response.ok || result.error) {
      const errorDetails = result.error
        ? `${result.error.status} (${result.error.code}): ${result.error.message}`
        : `${response.status} ${response.statusText}`;
      console.error(`Gemini API Error: ${errorDetails}`);
      throw new Error(`Gemini API request failed: ${errorDetails}`);
    }

    return result;
  }

  private parseResponse(
    apiResult: GeminiAPIResponse,
    requestedCount: number
  ): { names: string[]; message: string } {
    let names: string[] = [];
    let message = 'Failed to parse Gemini response.';

    try {
      // Extract text or structured JSON from the response
      const part = apiResult.candidates?.[0]?.content?.parts?.[0];
      const responseText = part?.text; // Assuming text response for now

      if (!responseText) {
        message = 'Empty or invalid content part in Gemini response.';
        console.warn(message, apiResult);
        return { names, message };
      }

      // Attempt 1: Try parsing as JSON (if responseMimeType was application/json)
      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed.names)) {
          names = parsed.names.map(String).slice(0, requestedCount);
          message = `Parsed ${names.length} names successfully via JSON from Gemini.`;
          return { names, message };
        } else if (Array.isArray(parsed)) {
          names = parsed.map(String).slice(0, requestedCount);
          message = `Parsed ${names.length} names successfully from direct array (Gemini).`;
          return { names, message };
        }
      } catch {
        // JSON parsing failed, proceed to regex or simple extraction
        console.warn(
          'Gemini: JSON parse failed, trying regex/simple extraction.'
        );
      }

      // Attempt 2: Regex for quoted strings (fallback if JSON fails or wasn't requested)
      const simpleQuotes = responseText.match(/"([^"]+)"/g);
      if (simpleQuotes) {
        names = simpleQuotes
          .map((q) => q.slice(1, -1))
          .filter(
            (name) =>
              name && name.trim().length > 0 && name.toLowerCase() !== 'names'
          )
          .slice(0, requestedCount);
        if (names.length > 0) {
          message = `Extracted ${names.length} names via simple quote regex (Gemini).`;
          return { names, message };
        }
      }

      // Attempt 3: Split by newline if no quotes found (very basic fallback)
      if (names.length === 0) {
        names = responseText
          .split('\n')
          .map((n) => n.trim())
          .filter(Boolean)
          .slice(0, requestedCount);
        if (names.length > 0) {
          message = `Extracted ${names.length} names via newline split (Gemini).`;
          return { names, message };
        }
      }
    } catch (error) {
      console.error('Gemini: Error during response parsing:', error);
      message = `Gemini response parsing error: ${
        error instanceof Error ? error.message : 'Unknown'
      }`;
    }

    console.error('Gemini: Failed to extract names from response:', apiResult);
    return { names: [], message }; // Return empty if all parsing fails
  }

  async generate(params: AIProviderRequestParams): Promise<AIProviderResponse> {
    const { model, systemPrompt, userPrompt, complexity, count = 5 } = params;

    // Construct the contents array for Gemini
    const contents: GeminiContent[] = [];
    if (systemPrompt) {
      // Gemini prefers system instructions within the first user message or specific fields
      // For simplicity here, we'll prepend it to the user prompt if provided.
      // Alternatively, use multi-turn context if the model supports it better.
      contents.push({ parts: [{ text: systemPrompt }] }); // Treat system as initial context
      contents.push({ parts: [{ text: userPrompt }] }); // Followed by user prompt
    } else {
      contents.push({ parts: [{ text: userPrompt }] });
    }

    // Define generation config - enabling JSON output
    const generationConfig: GeminiGenerationConfig = {
      temperature: this.calculateTemperature(complexity),
      maxOutputTokens: 1024, // Adjust as needed
      responseMimeType: 'application/json', // Request JSON output
      responseSchema: {
        // Define the expected JSON structure
        type: 'OBJECT',
        properties: {
          names: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: `Array of exactly ${count} character names`,
          },
        },
        required: ['names'],
      },
    };

    try {
      console.log('GeminiProvider generate called with:', {
        model,
        complexity,
        count /* prompts omitted for brevity */,
      });
      const apiResult = await this.callApi(model, contents, generationConfig);

      // Check for API level errors returned in the response body
      if (apiResult.error) {
        console.error('Gemini API returned an error:', apiResult.error);
        return {
          success: false,
          message: `Gemini API Error: ${apiResult.error.message}`,
          names: [],
          providerInfo: { provider: 'Gemini', model },
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
            provider: 'Gemini',
            model,
            rawResponse: apiResult, // Optional: include raw for debugging
          },
        };
      } else {
        // Parsing failed or returned no names
        return {
          success: false,
          message: `Gemini: ${parseMessage}`,
          names: [],
          providerInfo: {
            provider: 'Gemini',
            model,
            rawResponse: apiResult, // Optional: include raw for debugging
          },
        };
      }
    } catch (error) {
      console.error('Error generating names with Gemini:', error);
      return {
        success: false,
        message: `Gemini provider error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        names: [],
        providerInfo: { provider: 'Gemini', model },
      };
    }
  }
}
