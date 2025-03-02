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
): GenerateCharacterNamesReturnType {
  try {
    const { genre, styles, race, complexity, gender, count, length } = input;

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

Instructions:
- Generate EXACTLY ${count} unique character names that match the given attributes
- For genre "${genre}" with styles [${styles?.join(
      ', '
    )}] (If no styles are provided, use typical names for the genre)
- Race: ${race}
- Gender association: ${gender}
- Name length: ${length}. Short names must be singular, medium names can be one or two names, and long names can be complex and multi-syllabic.
- Complexity level: ${complexity}/10 (Higher means more unique names, but not more syllables. 9-10 typically means adding in more special-characters or uncommon letters like: ë'-ōūáöðøæå)

Race characteristics for "${race}":
- Incorporate typical phonetic patterns for this race
- Consider cultural connotations based on fantasy/gaming traditions

For the styles [${styles?.join(
      ', '
    )}], incorporate thematic elements that suggest these qualities.

For the list of names, make the first names slightly more simple and common and the last names slightly more complex and unique. This should barely be noticeable but will add a subtle layer of depth to the names.

RESPONSE FORMAT REQUIREMENTS:
1. You MUST respond with VALID JSON
2. Your response must be ONLY a JSON object with a "names" array containing EXACTLY ${count} strings. For example:
${nameExampleWithCount}
3. Do not include any explanations or additional text
4. Make sure the full list of names have good variety and are not too similar
`;

    // Use a structured user prompt
    const userPrompt = `${JSON.stringify(input)}`;
    // console.log('System prompt:', systemPrompt);
    // console.log('User prompt:', userPrompt);

    // Call the AI API
    const aiResult = await callCloudflareAI('@cf/meta/llama-3.2-3b-instruct', {
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
    });

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
  aiResult: { result: { response: string } },
  count: number
): GenerateCharacterNamesReturnType {
  try {
    // Get the response text
    let responseText = aiResult.result.response.trim();

    // First try the regex extraction methods that were previously fallbacks
    // since they're more consistently successful

    // 1. Try the name extractor regex first
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
        message: `Generated ${extractedNames.length} character names successfully`,
        names: extractedNames,
      };
    }

    // 2. If regex extractor fails, try simple quotation extraction
    const allQuotedStrings = responseText.match(/"([^"]+)"/g) || [];
    const simpleExtraction: string[] = allQuotedStrings
      .map((match: string): string => match.replace(/"/g, ''))
      .filter((name: string): boolean => name.length > 0 && name !== 'names')
      .slice(0, count);

    if (simpleExtraction.length > 0) {
      return {
        success: true,
        message: `Generated ${simpleExtraction.length} character names successfully`,
        names: simpleExtraction,
      };
    }

    // 3. Only try JSON.parse as a last resort since it's consistently failing
    try {
      // Try to fix potentially malformed JSON first
      if (responseText.includes('{"names":[') && !responseText.endsWith('}')) {
        responseText += '}';
      }

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
      }
    } catch (parseError) {
      // JSON parsing failed, but we already tried the extraction methods
      console.error('JSON parse error (final attempt):', parseError);
    }

    // If we get here, all parsing methods failed
    return {
      success: false,
      message: 'Failed to extract character names from AI response',
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
