import { CharacterNameInput } from '@/types/name-generator';

// Define the structure for the response from any AI provider
export type AIProviderResponse = {
  success: boolean;
  message: string;
  names: string[];
  providerInfo?: {
    provider: string;
    model: string;
    rawResponse?: unknown; // Optional: include raw response for debugging
  };
};

// Define the parameters needed to make a request to an AI provider
export type AIProviderRequestParams = CharacterNameInput & {
  model: string; // Specific model ID for the provider
  systemPrompt: string;
  userPrompt: string;
  // Add other common parameters like temperature if needed, or handle within providers
};

// Interface that all AI providers must implement
export interface IAIProvider {
  generate(params: AIProviderRequestParams): Promise<AIProviderResponse>;
}
