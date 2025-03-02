'use server';

import dotenv from 'dotenv';
import {
  CharacterNameInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';

// Initialize environment variables
dotenv.config();

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
    const { genre, styles, race, complexity, gender, count, length } = input;

    // Create system prompt with variables, similar to Cloudflare implementation
    const systemPrompt = `You are an expert at generating creative names for game characters with specific themes and styles.

Instructions:
- Generate EXACTLY ${count} unique character names that match the given attributes
- For genre "${genre}" with styles [${styles.join(', ')}]
- Race: ${race}
- Gender association: ${gender}
- Name length: ${length}. Short names should be singular and easy to remember, medium names should be more detailed, and long names can be complex and multi-syllabic.
- Complexity level: ${complexity}/10 (Higher means more unique/creative names)

Race characteristics for "${race}":
- Incorporate typical phonetic patterns for this race
- Consider cultural connotations based on fantasy/gaming traditions

For the list of names, make the first names slightly more simple and common and the last names slightly more complex and unique. This should barely be noticeable but will add a subtle layer of depth to the names.

For the styles [${styles.join(', ')}], incorporate thematic elements that suggest these qualities.`;

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
        message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        names: [],
      };
    }
  } catch (error) {
    console.error('Error generating character names with Gemini:', error);
    return {
      success: false,
      message: `Gemini AI error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      names: [],
    };
  }
}
