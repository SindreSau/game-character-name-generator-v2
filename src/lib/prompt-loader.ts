import fs from 'fs/promises';
import path from 'path';

/**
 * Loads a prompt template from the specified file, replaces placeholders, and returns the formatted string.
 * Placeholders should be in the format {{variableName}}.
 *
 * @param promptName - The base name of the prompt file (without extension) in the `src/prompts` directory.
 * @param variables - An object containing key-value pairs for placeholder replacement.
 * @returns The formatted prompt string.
 * @throws If the prompt file cannot be read or if a variable is missing.
 */
export async function loadPrompt(
  promptName: string,
  variables: Record<string, string | number | string[]>
): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    'src',
    'prompts',
    `${promptName}.md`
  );
  try {
    let template = await fs.readFile(filePath, 'utf-8');

    // Replace placeholders
    for (const key in variables) {
      const placeholder = `{{${key}}}`;
      let value = variables[key];

      // Ensure arrays are nicely formatted (e.g., comma-separated)
      if (Array.isArray(value)) {
        value = value.join(', ');
      }

      // Handle potential undefined/null values gracefully, though ideally inputs are validated beforehand
      const replacement =
        value !== undefined && value !== null ? String(value) : '';

      // Use a global regex to replace all occurrences
      const regex = new RegExp(
        placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
        'g'
      );
      template = template.replace(regex, replacement);
    }

    // Optional: Check if any placeholders remain (could indicate missing variables)
    const remainingPlaceholders = template.match(/{{(.*?)}}/g);
    if (remainingPlaceholders) {
      console.warn(
        `Warning: Unresolved placeholders in prompt "${promptName}": ${remainingPlaceholders.join(
          ', '
        )}`
      );
    }

    return template;
  } catch (error) {
    console.error(
      `Error loading prompt "${promptName}" from ${filePath}:`,
      error
    );
    throw new Error(`Failed to load prompt: ${promptName}`);
  }
}
