'use server';

import {
  CharacterNameInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';

/**
 * Call the Gemini API with the provided input, using structured output
 */
async function callGeminiAI(prompt: string, count?: number) {
  const API_KEY = process.env.GEMINI_API_TOKEN;

  if (!API_KEY) {
    throw new Error('GEMINI_API_TOKEN not found in environment variables');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.18,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              names: {
                type: 'ARRAY',
                items: {
                  type: 'STRING',
                },
                description: count
                  ? `Array of exactly ${count} character names`
                  : 'Array of character names',
              },
            },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error calling Gemini API: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Generate character names using Gemini API
 */
export async function generateCharacterNamesWithGemini(
  input: CharacterNameInput
): GenerateCharacterNamesReturnType {
  try {
    const { genre, styles, complexity, gender, count, length } = input;

    const nameExampleWithCount = JSON.stringify({
      names: Array.from({ length: count! }, (_, i) => `Name${i + 1}`),
    });
    const systemPrompt = `You are an expert at generating creative names for game characters with specific themes and styles.

Instructions:
- Generate EXACTLY ${count} unique character names that match the given attributes
- For genre "${genre}" with styles [${
      styles?.join(', ') || 'None specified'
    }]. If no styles are specified, think of general themes and typical game characters for the genre.
- Gender association: ${gender}
- Name length: ${length}. Short names should be singular and easy to remember, medium names should be more detailed, and long names can be complex and multi-syllabic.
- Complexity level: ${complexity}/5 - This works similarly to temperature for LLMs.

Complexity guide:
- 1: Simple and easy to remember 
- 2: Slightly more complex, but still common
- 3: Balanced complexity with a mix of common and unique names
- 4: More unique and complex names - add some special characters or unique spellings
    example:
      "Ætherion Voidheart",
      "Dråkos Stormweaver",
      "Nyxæla Shadowbane",
      "Quetzål Flamecaster",
      "Thørin Ravensoul"
- 5: Highly unique and complex names - include special characters, unique spellings, or rare words
    example:
      "Ætherion Vøid'heart",
      "Dråkos Þunder'weaver",
      "Nyxæla Shadøw'bane",
      "Quetzål Flame'caster",
      "Thørin Råven'soul"

For the list of names, make the first names slightly more simple and common and the last names slightly more complex and unique. This should be noticeable and add a subtle layer of depth to the names.

RESPONSE FORMAT REQUIREMENTS:
1. You MUST respond with VALID JSON
2. Your response must be ONLY a JSON object with a "names" array containing EXACTLY ${count} strings
3. The closing bracket } MUST be included
4. Do not include any explanations or additional text

Example: ${nameExampleWithCount}
`;

    // Use a structured user prompt, like in the Cloudflare version
    const userPrompt = `${JSON.stringify(input)}`;

    // Combine prompts for the Gemini API call
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Call the Gemini API with structured output
    const geminiResult = await callGeminiAI(fullPrompt, count!);

    // Extract the names directly from the structured JSON response
    const responseJson =
      geminiResult.candidates?.[0]?.content?.parts?.[0]?.functionCall
        ?.response || geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseJson) {
      return {
        success: false,
        message: 'Empty or invalid response from Gemini API',
        names: [],
      };
    }

    // Parse the JSON response if it's a string or use it directly if it's already parsed
    try {
      let namesData;
      if (typeof responseJson === 'string') {
        namesData = JSON.parse(responseJson);
      } else {
        namesData = responseJson;
      }

      if (Array.isArray(namesData.names) && namesData.names.length > 0) {
        return {
          success: true,
          message: `Generated ${namesData.names.length} character names successfully with Gemini`,
          names: namesData.names.slice(0, count),
        };
      } else {
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('Error parsing Gemini API response:', error);
      return {
        success: false,
        message: `Parse error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        names: [],
      };
    }
  } catch (error) {
    console.error('Error generating character names with Gemini:', error);
    return {
      success: false,
      message: `Gemini AI error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}
