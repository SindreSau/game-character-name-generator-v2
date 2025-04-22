import { loadPrompt } from '@/lib/prompt-loader';
import { CharacterNameInput } from '@/types/name-generator';

const SYSTEM_PROMPT_NAME = 'character-name-generator.system';

/**
 * Constructs the user prompt string based on the form input.
 */
function buildUserPrompt(input: CharacterNameInput): string {
  let prompt = `Generate ${input.count} unique character names suitable for the ${input.genre} genre.`;

  if (input.styles && input.styles.length > 0) {
    prompt += ` The names should evoke a feeling of: ${input.styles.join(
      ', '
    )}.`;
  }

  if (input.race) {
    prompt += ` Consider names appropriate for the ${input.race} race/species.`;
  }

  if (input.class) {
    prompt += ` The character's class/role is ${input.class}.`;
  }

  if (input.gender) {
    prompt += ` The character's gender is ${input.gender}.`;
  }

  if (input.customInstructions) {
    prompt += ` Additional instructions: ${input.customInstructions}`;
  }

  prompt += `\n\nDesired complexity/creativity level: ${input.complexity} (1=Simple, 5=Very Creative).`;
  prompt += `\n\nReturn the names as a JSON object with a single key "names" containing an array of strings, like {"names": ["Name1", "Name2", ...]}. Ensure the array contains exactly ${input.count} names.`;

  return prompt;
}

/**
 * Loads the system prompt and builds the user prompt for character name generation.
 *
 * @param input - The character name generation parameters from the form.
 * @returns An object containing the system and user prompts.
 * @throws If the system prompt file cannot be loaded.
 */
export async function buildCharacterNamePrompts(
  input: CharacterNameInput
): Promise<{ systemPrompt: string; userPrompt: string }> {
  try {
    // Load the base system prompt, passing all relevant input values as placeholders.
    const systemPromptTemplate = await loadPrompt(SYSTEM_PROMPT_NAME, {
      count: input.count ?? 5,
      genre: input.genre || 'any', // Provide defaults if needed
      styles: input.styles?.join(', ') || 'any',
      gender: input.gender || 'neutral',
      length: input.length || 'medium',
      complexity: input.complexity ?? 3,
      // Add any other placeholders your system prompt uses
    });

    // Construct the specific user prompt based on the input details.
    const userPrompt = buildUserPrompt(input);

    return {
      systemPrompt: systemPromptTemplate,
      userPrompt,
    };
  } catch (error) {
    console.error(`Error building character name prompts: ${error}`);
    // Re-throw or handle as appropriate for the calling Server Action
    throw new Error(
      `Failed to prepare prompts for AI generation: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
