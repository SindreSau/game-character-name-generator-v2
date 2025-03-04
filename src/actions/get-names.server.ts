'use server';
import { generateCharacterNamesWithCloudflare } from './ai-endpoint-functions/cloudflare.server';
import { generateCharacterNamesWithGemini } from './ai-endpoint-functions/gemini.server';
import {
  CharacterNameInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';

/**
 * Main action function to generate character names
 * This handles validation and orchestrates the name generation process
 */
export async function generateCharacterNames(
  input: CharacterNameInput,
  failCloudflare = false
): GenerateCharacterNamesReturnType {
  // No need to repeat 'use server' directive here since it's already at the top

  try {
    // Validate input
    const validationResult = validateInput(input);
    if (!validationResult.isValid) {
      return {
        success: false,
        message: validationResult.message,
        names: [],
      };
    }

    // Set defaults for optional fields
    const processedInput = {
      ...input,
      complexity: input.complexity || 3,
      gender: input.gender || 'neutral',
      count: input.count || 10,
      length: input.length || 'medium',
    };

    // Primary generation method (Cloudflare)
    try {
      const result = await generateCharacterNamesWithCloudflare(
        processedInput,
        failCloudflare
      );
      if (result.success) {
        return {
          ...result,
          provider: 'cloudflare',
        };
      }

      // If primary method fails, try the Gemini fallback
      console.log(
        'Primary name generation with Cloudflare failed, trying Gemini fallback...'
      );
      const fallbackResult = await generateCharacterNamesWithGemini(
        processedInput
      );

      return {
        ...fallbackResult,
        provider: 'gemini',
        message: fallbackResult.success
          ? `${fallbackResult.message} (Cloudflare failed, used Gemini as fallback)`
          : fallbackResult.message,
      };
    } catch (error) {
      console.error('Error in primary name generation with Cloudflare:', error);

      // Try Gemini as fallback
      try {
        console.log('Trying Gemini as fallback due to Cloudflare error...');
        const fallbackResult = await generateCharacterNamesWithGemini(
          processedInput
        );

        return {
          ...fallbackResult,
          provider: 'gemini',
          message: fallbackResult.success
            ? `${fallbackResult.message} (Cloudflare error, used Gemini as fallback)`
            : fallbackResult.message,
        };
      } catch (fallbackError) {
        console.error(
          'Error in fallback name generation with Gemini:',
          fallbackError
        );
        return {
          success: false,
          message: 'Both Cloudflare and Gemini name generation methods failed',
          names: [],
        };
      }
    }
  } catch (error) {
    console.error('Error in generateCharacterNames action:', error);
    return {
      success: false,
      message: `Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}

/**
 * Validates the input parameters for character name generation
 */
function validateInput(input: CharacterNameInput): {
  isValid: boolean;
  message: string;
} {
  // Check required fields
  if (!input.genre) {
    return {
      isValid: false,
      message: 'Invalid input: genre is required',
    };
  }

  // Check that styles is an array with at least one element
  if (!Array.isArray(input.styles)) {
    return {
      isValid: false,
      message: 'Invalid input: styles array must contain at least one style',
    };
  }

  // Validate complexity if provided
  if (input.complexity !== undefined) {
    const complexityNum = Number(input.complexity);
    if (isNaN(complexityNum) || complexityNum < 1 || complexityNum > 5) {
      return {
        isValid: false,
        message: 'Complexity must be between 1 and 10',
      };
    }
  }

  // Validate count if provided
  if (input.count !== undefined) {
    const countNum = Number(input.count);
    if (isNaN(countNum) || countNum < 1 || countNum > 100) {
      return {
        isValid: false,
        message: 'Count must be between 1 and 100',
      };
    }
  }

  // Validate gender if provided
  if (
    input.gender !== undefined &&
    !['neutral', 'masculine', 'feminine'].includes(input.gender)
  ) {
    return {
      isValid: false,
      message: "Gender must be 'neutral', 'masculine', or 'feminine'",
    };
  }

  return { isValid: true, message: 'Input is valid' };
}
