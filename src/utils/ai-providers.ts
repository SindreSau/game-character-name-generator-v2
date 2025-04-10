import { generateCharacterNamesWithCloudflare } from '@/actions/ai-endpoint-functions/cloudflare.server';
import { generateCharacterNamesWithGemini } from '@/actions/ai-endpoint-functions/gemini.server';

type AIProviderParams = {
  systemPrompt: string;
  userPrompt: string;
  count: number;
};

type gender = 'neutral' | 'masculine' | 'feminine';
type length = 'short' | 'medium' | 'long';

// Function to generate names using Cloudflare by leveraging existing endpoint functions
export async function generateWithCloudflare({
  systemPrompt,
  userPrompt,
  count,
}: AIProviderParams): Promise<{
  success: boolean;
  message: string;
  names: string[];
}> {
  try {
    // Create a simpler input structure that matches what the existing function expects
    const input = {
      genre: 'Fantasy',
      styles: ['Path of Exile 2', 'Dark Fantasy'],
      complexity: 3,
      gender: 'masculine' as gender,
      count: count,
      length: 'medium' as length,
      systemPromptOverride: systemPrompt,
      userPromptOverride: userPrompt,
    };

    // Use the existing CloudflareAI function
    const result = await generateCharacterNamesWithCloudflare(input, false);
    return result;
  } catch (error) {
    console.error('Cloudflare generation error:', error);
    return {
      success: false,
      message: `Cloudflare AI error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}

// Function to generate names using Gemini by leveraging existing endpoint functions
export async function generateWithGemini({
  systemPrompt,
  userPrompt,
  count,
}: AIProviderParams): Promise<{
  success: boolean;
  message: string;
  names: string[];
}> {
  try {
    // Create a simpler input structure that matches what the existing function expects
    const input = {
      genre: 'Fantasy',
      styles: ['Path of Exile 2', 'Dark Fantasy'],
      complexity: 3,
      gender: 'neutral' as gender,
      count: count,
      length: 'medium' as length,
      systemPromptOverride: systemPrompt,
      userPromptOverride: userPrompt,
    };

    // Use the existing GeminiAI function
    const result = await generateCharacterNamesWithGemini(input);
    return result;
  } catch (error) {
    console.error('Gemini generation error:', error);
    return {
      success: false,
      message: `Gemini AI error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}

// Function that tries Cloudflare first, falls back to Gemini
export async function generateWithFallback(params: AIProviderParams): Promise<{
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
}> {
  // First try with Cloudflare
  const cloudflareResult = await generateWithCloudflare(params);

  if (cloudflareResult.success && cloudflareResult.names.length > 0) {
    return { ...cloudflareResult, provider: 'Cloudflare' };
  }

  // Fall back to Gemini if Cloudflare fails
  console.log('Falling back to Gemini for name generation');
  const geminiResult = await generateWithGemini(params);
  return { ...geminiResult, provider: 'Gemini' };
}
