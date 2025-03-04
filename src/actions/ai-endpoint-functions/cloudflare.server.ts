'use server';

import {
  CharacterNameInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';

// Type definitions
type AIMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

type CloudflareAIResult = {
  result: {
    response: string;
    [key: string]: unknown;
  };
  success: boolean;
  errors: string[];
  messages: string[];
};

/**
 * Call the Cloudflare AI API with the specified model and input
 */
async function callCloudflareAI(
  model: string,
  input: { messages: AIMessage[] },
  complexity: number
): Promise<CloudflareAIResult> {
  const accountId =
    process.env.CLOUDFLARE_ACCOUNT_ID || 'e7692f5aa2217d2df0ebcfeb66d4fb08';

  const temperatureFromComplexity = (complexity: number): number => {
    switch (complexity) {
      case 1:
        return 0.1;
      case 2:
        return 0.3;
      case 3:
        return 0.5;
      case 4:
        return 0.7;
      case 5:
        return 1;
      default:
        return 0.5;
    }
  };

  console.log(
    'Calling Cloudflare AI with temperature:',
    temperatureFromComplexity(complexity)
  );
  console.log('Input:', input);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        ...input,
        temperature: temperatureFromComplexity,
      }),
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
): GenerateCharacterNamesReturnType {
  try {
    const { genre, styles, complexity, gender, count, length } = input;

    // Check if the request should be forced to fail
    if (forceFail) {
      console.warn('Forced failure enabled, skipping Cloudflare AI call.');
      return {
        success: false,
        message: 'Forced failure: AI request not sent.',
        names: [],
      };
    }

    const nameExampleWithCount = JSON.stringify({
      names: Array.from({ length: count! }, (_, i) => `Name${i + 1}`),
    });

    const systemPrompt = `You are an expert at generating creative names for game characters with specific themes and styles.

    RESPONSE FORMAT REQUIREMENTS:
1. You MUST respond with VALID JSON
2. Your response must be ONLY a JSON object with a "names" array containing EXACTLY ${count} strings
3. The closing bracket } MUST be included
4. Do not include any explanations or additional text

Example: ${nameExampleWithCount}
    
Instructions:
- Generate EXACTLY ${count} unique character names that match the given attributes
- For genre "${genre}" with styles [${
      styles?.join(', ') || 'None specified'
    }]. If no styles are specified, think of general themes and typical game characters for the genre.
- Gender association: ${gender}
- Name length: ${length}. Short names should be singular and easy to remember, medium names should be more detailed, and long names can be complex and multi-syllabic.
- Complexity level: ${complexity}/5 - Describes the complexity of the names, similar to temperature for LLMs.

Complexity guide:
1/5 = Simple and easy to remember
2/5 = Slightly more complex, but still common
3/5 = Balanced complexity with a mix of common and unique names
4/5 = More unique and complex names - add some special characters or unique spellings
5/5 = Highly unique and complex names - MUST INCLUDE special characters like ', ", Æ, Þ etc.

BEFORE YOU RESPOND, ENSURE THAT YOU HAVE FOLLOWED ALL THE REQUIREMENTS PERFECTLY!
`;

    // Remove forceFail: true and count: x from the input
    delete input.count;
    const userPrompt = `${JSON.stringify(input)}`;
    // console.log('Generating response with Cloudflare AI:', systemPrompt);
    // console.log('userPrompt: ', userPrompt);

    // Call the AI API
    const aiResult = await callCloudflareAI(
      '@cf/meta/llama-3.2-3b-instruct',
      {
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      },
      complexity || 3
    );

    return parseAIResponse(aiResult, count!);
  } catch (error) {
    console.error('Error generating character names with Cloudflare:', error);
    return {
      success: false,
      message: `Cloudflare AI error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}

/**
 * Parse and extract names from the AI response
 */
async function parseAIResponse(
  aiResult: CloudflareAIResult,
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
      message: `Parse error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}
