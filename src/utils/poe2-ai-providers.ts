import { generateWithCloudflare, generateWithGemini } from './ai-providers';

type AIProviderParams = {
  systemPrompt: string;
  userPrompt: string;
  count: number;
};

// Function that tries Gemini first, falls back to Cloudflare
export async function generateWithPoE2Fallback(
  params: AIProviderParams
): Promise<{
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
}> {
  // First try with Gemini
  const geminiResult = await generateWithGemini(params);

  if (geminiResult.success && geminiResult.names.length > 0) {
    return { ...geminiResult, provider: 'Gemini' };
  }

  // Fall back to Cloudflare if Gemini fails
  console.log('Falling back to Cloudflare for name generation');
  const cloudflareResult = await generateWithCloudflare(params);
  return { ...cloudflareResult, provider: 'Cloudflare' };
}
