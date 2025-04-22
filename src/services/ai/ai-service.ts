import { CloudflareProvider } from './providers/cloudflare.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AIProviderResponse, IAIProvider } from './types';
import { aiConfig, getModelConfigById, ModelConfig } from '@/config/ai.config';

// Define the input config for the generic generate method
export type GenericGenerationConfig = {
  modelId?: string; // Optional: Defaults to the first enabled Cloudflare model
  complexity?: number; // Optional: Defaults to 3
  count?: number; // Optional: Defaults to 5
  providerOrder?: ('cloudflare' | 'gemini')[]; // Optional: Specify provider preference
};

export class AIService {
  private providers: Map<string, IAIProvider>;

  constructor() {
    this.providers = new Map();
    // Initialize providers only if their config is valid
    try {
      this.providers.set('cloudflare', new CloudflareProvider());
    } catch (error) {
      console.warn('Failed to initialize CloudflareProvider:', error);
    }
    try {
      this.providers.set('gemini', new GeminiProvider());
    } catch (error) {
      console.warn('Failed to initialize GeminiProvider:', error);
    }
  }

  private getProvider(
    providerName: 'cloudflare' | 'gemini'
  ): IAIProvider | undefined {
    return this.providers.get(providerName);
  }

  private getModelConfig(requestedModelId?: string): ModelConfig | undefined {
    let modelConfig = requestedModelId
      ? getModelConfigById(requestedModelId)
      : undefined;

    // Fallback to default if requested model not found or disabled
    if (!modelConfig || !modelConfig.enabled) {
      if (requestedModelId) {
        console.warn(
          `Requested model "${requestedModelId}" not found or disabled. Falling back to default.`
        );
      }
      modelConfig = aiConfig.models.find(
        (m) => m.provider === 'cloudflare' && m.enabled
      );
      if (!modelConfig) {
        modelConfig = aiConfig.models.find(
          (m) => m.provider === 'gemini' && m.enabled
        );
      }
    }
    return modelConfig;
  }

  async generate(
    systemPrompt: string,
    userPrompt: string,
    config: GenericGenerationConfig = {}
  ): Promise<AIProviderResponse> {
    const {
      modelId: requestedModelId,
      complexity = 3,
      count = 5,
      providerOrder: requestedProviderOrder,
    } = config;

    // Use const as per eslint prefer-const
    const initialModelConfig = this.getModelConfig(requestedModelId);

    if (!initialModelConfig) {
      console.error('No enabled AI models configured.');
      return {
        success: false,
        message: 'No enabled AI models configured.',
        names: [],
      };
    }

    // Determine provider order: explicit -> model's provider -> default fallback order
    const defaultOrder: ('cloudflare' | 'gemini')[] = ['cloudflare', 'gemini'];
    const providerOrder = requestedProviderOrder
      ? requestedProviderOrder
      : initialModelConfig.provider === 'gemini'
      ? ['gemini', 'cloudflare']
      : defaultOrder;

    console.log(
      `Attempting generation with provider order: ${providerOrder.join(', ')}`
    );

    for (const providerName of providerOrder) {
      let currentModelConfig = initialModelConfig;

      // If the current provider in the order doesn't match the initial model's provider,
      // find a suitable model for *this* provider.
      if (currentModelConfig.provider !== providerName) {
        const fallbackModelForProvider = aiConfig.models.find(
          (m) => m.provider === providerName && m.enabled
        );
        if (fallbackModelForProvider) {
          console.log(
            `Switching to model "${fallbackModelForProvider.id}" for provider "${providerName}"`
          );
          currentModelConfig = fallbackModelForProvider;
        } else {
          console.warn(
            `No enabled model found for provider "${providerName}". Skipping.`
          );
          continue; // Skip to the next provider in the order
        }
      }

      // Fix: cast providerName to the correct type
      const provider = this.getProvider(
        providerName as 'cloudflare' | 'gemini'
      );
      if (!provider) {
        console.warn(
          `Provider "${providerName}" is not available or failed to initialize.`
        );
        continue; // Try the next provider
      }

      console.log(
        `Attempting generation with ${providerName} using model ${currentModelConfig.modelId} (${currentModelConfig.id})`
      );

      try {
        // Fix: add genre: '' to satisfy required property
        const result = await provider.generate({
          model: currentModelConfig.modelId,
          systemPrompt,
          userPrompt,
          complexity,
          count,
          genre: '', // minimal stub, not used by new providers
        });

        // Add provider/model info to the result for clarity, using the config ID
        result.providerInfo = {
          ...result.providerInfo,
          provider: providerName,
          model: currentModelConfig.id, // Report the model config ID used
        };

        if (result.success && result.names.length > 0) {
          console.log(`Generation successful with ${providerName}.`);
          return result; // Success!
        } else {
          console.warn(
            `Generation failed or returned no names with ${providerName} (${currentModelConfig.id}). Reason: ${result.message}`
          );
          // Continue to the next provider (fallback)
        }
      } catch (error) {
        console.error(
          `Error during generation attempt with ${providerName} (${currentModelConfig.id}):`,
          error
        );
        // Continue to the next provider on error
      }
    }

    console.error('All AI providers failed to generate names.');
    return {
      success: false,
      message: 'All AI providers failed to generate names.',
      names: [],
    };
  }
}
