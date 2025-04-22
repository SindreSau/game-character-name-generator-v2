import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import { loadPrompt } from '@/lib/prompt-loader';

// Mock the fs/promises module
vi.mock('fs/promises');

describe('loadPrompt', () => {
  const mockPromptContent = `# Test Prompt\nGenerate {{count}} names for {{genre}}.\nStyles: {{styles}}.`;
  const promptName = 'test-prompt.system';
  const variables = {
    count: 3,
    genre: 'Fantasy',
    styles: ['Dark', 'Mystical'],
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    // Mock console.warn to check for warnings
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.warn
    vi.restoreAllMocks();
  });

  it('should load and format the prompt correctly', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(mockPromptContent);

    const expectedOutput = `# Test Prompt\nGenerate 3 names for Fantasy.\nStyles: Dark, Mystical.`;
    const result = await loadPrompt(promptName, variables);

    expect(fs.readFile).toHaveBeenCalledWith(
      expect.stringContaining('src/prompts/test-prompt.system.md'),
      'utf-8'
    );
    expect(result).toBe(expectedOutput);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should handle missing variables and log a warning', async () => {
    const incompleteVariables = { count: 5 }; // Missing genre and styles
    vi.mocked(fs.readFile).mockResolvedValue(mockPromptContent);

    const expectedOutput = `# Test Prompt\nGenerate 5 names for {{genre}}.\nStyles: {{styles}}.`; // Placeholders remain
    const result = await loadPrompt(promptName, incompleteVariables);

    expect(result).toBe(expectedOutput);
    // Fix: Expect a single string containing the relevant parts
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        `Warning: Unresolved placeholders in prompt "${promptName}": {{genre}}, {{styles}}`
      )
    );
  });

  it('should throw an error if the file cannot be read', async () => {
    const readError = new Error('File not found');
    vi.mocked(fs.readFile).mockRejectedValue(readError);

    await expect(loadPrompt(promptName, variables)).rejects.toThrow(
      `Failed to load prompt: ${promptName}`
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should handle numeric and single string array variables', async () => {
    const mixedVariables = {
      count: 1,
      genre: 'Sci-Fi',
      styles: ['Cyberpunk'],
    };
    vi.mocked(fs.readFile).mockResolvedValue(mockPromptContent);

    const expectedOutput = `# Test Prompt\nGenerate 1 names for Sci-Fi.\nStyles: Cyberpunk.`;
    const result = await loadPrompt(promptName, mixedVariables);
    expect(result).toBe(expectedOutput);
  });
});
