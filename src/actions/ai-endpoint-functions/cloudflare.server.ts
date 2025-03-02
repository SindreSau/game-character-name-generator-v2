'use server';

import dotenv from 'dotenv';
import {
  CharacterNameInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';
import { getEnv } from '@/utils/env.server';

// Initialize environment variables
dotenv.config();

// Type definitions
type AIMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

/**
 * Call the Cloudflare AI API with the specified model and input
 */
async function callCloudflareAI(
  model: string,
  input: { messages: AIMessage[] }
) {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID || 'e7692f5aa2217d2df0ebcfeb66d4fb08';

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ ...input }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching AI response: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Generate character names using Cloudflare AI
 */
export async function generateCharacterNamesWithCloudflare(
  input: CharacterNameInput,
  forceFail = false
): Promise<GenerateCharacterNamesReturnType> {
  // For testing fallback mechanism
  if (forceFail) {
    throw new Error('Forced failure for testing');
  }

  try {
    const apiKey = getEnv('CLOUDFLARE_API_KEY');
    const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
    // Rest of the function...

    // Mock implementation for example
    return {
      success: true,
      message: 'Successfully generated names with Cloudflare',
      names: ['Example name 1', 'Example name 2', 'Example name 3'],
    };
  } catch (error) {
    console.error('Error in Cloudflare name generation:', error);
    return {
      success: false,
      message: `Cloudflare error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      names: [],
    };
  }
}

/**
 * Parse and extract names from the AI response
 */
async function parseAIResponse(
  aiResult: any,
  count: number
): GenerateCharacterNamesReturnType {
  try {
    // Try to fix potentially malformed JSON first
    let responseText = aiResult.result.response.trim();

    // Add closing bracket if missing
    if (responseText.includes('{"names":[') && !responseText.endsWith('}')) {
      responseText += '}';
    }

    try {
      const parsedResponse = JSON.parse(responseText);

      if (
        Array.isArray(parsedResponse.names) &&
        parsedResponse.names.length > 0
      ) {
        return {
          success: true,
          message: `Generated ${parsedResponse.names.length} character names successfully`,
          names: parsedResponse.names.slice(0, count),
        };
      }
      // Also try handling case where it's a direct array
      else if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
        return {
          success: true,
          message: `Generated ${parsedResponse.length} character names from array`,
          names: parsedResponse.slice(0, count),
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Attempting fallback parsing...');

      // Improved fallback regex that specifically targets names in array
      const nameExtractor =
        /(?:"names"\s*:\s*\[\s*)?(?<=(?:"names"\s*:\s*\[\s*)?|(?:\[\s*)?|(?:,\s*))("([^"]+)")(?=[,\]\}])/g;
      const matches = [...responseText.matchAll(nameExtractor)];

      // Extract actual names while avoiding the word "names" when it's not inside quotes in the array
      const extractedNames: string[] = matches
        .map((match) => match[2]) // Get the name from the capturing group
        .filter((name) => name && name !== 'names')
        .slice(0, count);

      if (extractedNames.length > 0) {
        return {
          success: true,
          message: `Extracted ${extractedNames.length} names with fallback method`,
          names: extractedNames,
        };
      }

      // Last resort: if all else fails, try a simple quotation extraction
      const allQuotedStrings = responseText.match(/"([^"]+)"/g) || [];
      const simpleExtraction: string[] = allQuotedStrings
        .map((match: string): string => match.replace(/"/g, ''))
        .filter((name: string): boolean => name.length > 0 && name !== 'names')
        .slice(0, count);

      if (simpleExtraction.length > 0) {
        return {
          success: true,
          message: 'Names extracted using last-resort method',
          names: simpleExtraction,
        };
      }
    }

    return {
      success: false,
      message: 'Failed to parse AI response',
      names: [],
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      success: false,
      message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      names: [],
    };
  }
}
