// Configuration for AI providers and models

export type ModelConfig = {
  id: string; // Unique identifier for internal use (e.g., 'gemini-flash')
  name: string; // User-facing name (e.g., 'Gemini Flash')
  provider: 'cloudflare' | 'gemini';
  modelId: string; // Actual model ID used by the provider API
  enabled: boolean;
};

export const aiConfig = {
  // Define available models
  models: [
    {
      id: 'llama-3-8b',
      name: 'Llama 3 8B (Cloudflare)',
      provider: 'cloudflare',
      modelId: '@cf/meta/llama-3-8b-instruct',
      enabled: true,
    },
    {
      id: 'gemini-flash',
      name: 'Gemini 1.5 Flash',
      provider: 'gemini',
      modelId: 'gemini-1.5-flash-latest', // Using the latest alias
      enabled: true,
    },
    // Add other models as needed
    // {
    //   id: 'gemini-pro',
    //   name: 'Gemini 1.0 Pro',
    //   provider: 'gemini',
    //   modelId: 'gemini-1.0-pro',
    //   enabled: false,
    // },
  ] as ModelConfig[],

  // Default settings
  defaultProvider: 'cloudflare' as 'cloudflare' | 'gemini',
  fallbackProvider: 'gemini' as 'cloudflare' | 'gemini',
  defaultModelId: 'llama-3-8b', // Default model to use if not specified

  // Default parameters (can be overridden)
  defaultTemperature: 0.7, // Example default temperature
  defaultMaxTokens: 512,
};

// Helper function to get model config by ID
export function getModelConfigById(id: string): ModelConfig | undefined {
  return aiConfig.models.find((model) => model.id === id && model.enabled);
}
