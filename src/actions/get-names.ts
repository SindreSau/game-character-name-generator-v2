'use server';

import { generateCharacterNamesWithCloudflare } from './ai-endpoint-functions/cloudflare';

// Type definitions
type NameAttributes = {
  length: number;
};

type CharacterNameInput = {
  genre: string; // Game genre (RPG, Fantasy, Sci-Fi, etc.)
  styles: string[]; // Style descriptors (fire, elemental, ninja, etc.)
  race?: string; // Character race (human, elf, dwarf, orc, etc.)
  complexity?: string | number; // How complex the name should be (1-10)
  gender?: 'neutral' | 'masculine' | 'feminine'; // Gender association for the name
  count?: number; // Number of names to generate
};

type GenerateCharacterNamesReturnType = Promise<{
  success: boolean;
  message: string;
  names: string[];
}>;

/**
 * Main action function to generate character names
 * This handles validation and orchestrates the name generation process
 */
export async function generateCharacterNames(
  input: CharacterNameInput
): GenerateCharacterNamesReturnType {
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
      race: input.race || 'human',
      complexity: input.complexity || 5,
      gender: input.gender || 'neutral',
      count: input.count || 5,
    };

    // Primary generation method (Cloudflare)
    try {
      const result = await generateCharacterNamesWithCloudflare(processedInput);
      if (result.success) {
        return result;
      }
      // If primary method fails, we could add fallbacks here
      console.log('Primary name generation failed, trying fallback...');
      // return await generateWithFallbackMethod(processedInput);
    } catch (error) {
      console.error('Error in primary name generation:', error);
      // Could add fallback here
      // return await generateWithFallbackMethod(processedInput);
    }

    // If no method succeeded or no fallback is implemented yet
    return {
      success: false,
      message: 'Failed to generate names with available methods',
      names: [],
    };
  } catch (error) {
    console.error('Error in generateCharacterNames action:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
  if (
    !input.genre ||
    !Array.isArray(input.styles) ||
    input.styles.length === 0
  ) {
    return {
      isValid: false,
      message: 'Invalid input: genre and non-empty styles array are required',
    };
  }

  // Validate complexity if provided
  if (input.complexity !== undefined) {
    const complexityNum = Number(input.complexity);
    if (isNaN(complexityNum) || complexityNum < 1 || complexityNum > 10) {
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

// Placeholder for future fallback implementation
/*
async function generateWithFallbackMethod(
  input: CharacterNameInput
): GenerateCharacterNamesReturnType {
  // Implementation for fallback methods will go here
  return {
    success: false,
    message: 'Fallback method not implemented yet',
    names: [],
  };
}
*/
