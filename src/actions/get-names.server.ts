'use server';

import { AIService } from '@/services/ai/ai-service';
import { buildCharacterNamePrompts } from '@/services/prompt-builders/character-name-builder';
import { CharacterNameInput } from '@/types/name-generator';
import { AIProviderResponse } from '@/services/ai/types';

// Re-export the type for the client
export type { CharacterNameInput };

/**
 * Server Action to generate character names using the AI service.
 *
 * @param input - The character name generation parameters from the form.
 * @returns An AIProviderResponse containing the success status, message, and generated names.
 */
export async function getNames(
  input: CharacterNameInput
): Promise<AIProviderResponse> {
  console.log('getNames Server Action called with input:', input);

  try {
    // 1. Build the prompts using the dedicated builder
    const { systemPrompt, userPrompt } = await buildCharacterNamePrompts(input);

    // 2. Instantiate the generic AI service
    const aiService = new AIService();

    // 3. Call the generic generate method with prompts and config
    const result = await aiService.generate(systemPrompt, userPrompt, {
      modelId: input.modelId, // Pass model preference from input
      complexity: input.complexity,
      count: input.count,
      // providerOrder: input.providerOrder // Pass if you add providerOrder to CharacterNameInput
    });

    console.log('AI Service Result:', result);
    return result;
  } catch (error) {
    console.error('Error in getNames Server Action:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred during name generation.';
    // Ensure a consistent error response structure
    return {
      success: false,
      message: `Server Action Error: ${errorMessage}`,
      names: [],
      // Optionally include provider info if available/relevant in error cases
      providerInfo: { provider: 'N/A', model: input.modelId || 'default' },
    };
  }
}
