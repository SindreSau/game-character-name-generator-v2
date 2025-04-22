import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CloudflareProvider } from '@/services/ai/providers/cloudflare.provider';
import { AIProviderRequestParams } from '@/services/ai/types';

// Mock environment variables
vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'test-account-id');
vi.stubEnv('CLOUDFLARE_API_TOKEN', 'test-api-token');

// Mock global fetch
global.fetch = vi.fn();

describe('CloudflareProvider', () => {
  let provider: CloudflareProvider;
  const mockParams: AIProviderRequestParams = {
    model: '@cf/meta/llama-3-8b-instruct',
    systemPrompt: 'System prompt {{count}}',
    userPrompt: 'User prompt',
    genre: 'Fantasy',
    count: 3,
    complexity: 3,
  };

  beforeEach(() => {
    // Ensure env vars are set correctly before each test
    vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'test-account-id');
    vi.stubEnv('CLOUDFLARE_API_TOKEN', 'test-api-token');
    provider = new CloudflareProvider();
    vi.resetAllMocks(); // Reset mocks including fetch
    // Mock console.warn/error to avoid polluting test output
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs(); // Clean up stubs after each test
    vi.restoreAllMocks();
  });

  it('should initialize correctly with env variables', () => {
    expect(provider).toBeInstanceOf(CloudflareProvider);
  });

  it('should throw error if env variables are missing', () => {
    // Fix: Stub BOTH required env vars as empty to ensure the constructor throws
    vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', '');
    vi.stubEnv('CLOUDFLARE_API_TOKEN', '');
    expect(() => new CloudflareProvider()).toThrow(
      'Cloudflare Account ID or API Token not configured'
    );
    // No need to unstub/restore here, afterEach handles it
  });

  it('should call Cloudflare API with correct parameters and parse valid JSON response', async () => {
    const mockApiResponse = {
      result: {
        response: JSON.stringify({ names: ['Name1', 'Name2', 'Name3'] }),
      },
      success: true,
      errors: [],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
      text: async () => JSON.stringify(mockApiResponse),
      status: 200,
      statusText: 'OK',
    } as Response);

    const result = await provider.generate(mockParams);

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'test-account-id/ai/run/@cf/meta/llama-3-8b-instruct'
      ),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-token',
          'Content-Type': 'application/json',
        }),
        // Fix: Expect 0.65 for complexity 3
        body: expect.stringContaining('"temperature":0.65'),
      })
    );
    expect(result.success).toBe(true);
    expect(result.names).toEqual(['Name1', 'Name2', 'Name3']);
    expect(result.message).toContain('Parsed 3 names successfully via JSON');
    expect(result.providerInfo?.provider).toBe('Cloudflare');
    expect(result.providerInfo?.model).toBe(mockParams.model);
  });

  it('should handle API failure response', async () => {
    const mockApiResponse = {
      result: null,
      success: false,
      errors: ['Model not found'],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true, // API call itself succeeded, but operation failed
      json: async () => mockApiResponse,
      text: async () => JSON.stringify(mockApiResponse),
      status: 200,
      statusText: 'OK',
    } as Response);

    const result = await provider.generate(mockParams);

    expect(result.success).toBe(false);
    expect(result.names).toEqual([]);
    expect(result.message).toContain('Cloudflare API error: Model not found');
  });

  it('should handle fetch network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Error'));

    const result = await provider.generate(mockParams);

    expect(result.success).toBe(false);
    expect(result.names).toEqual([]);
    expect(result.message).toContain(
      'Cloudflare provider error: Network Error'
    );
  });

  it('should handle fetch non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Bad Request' }),
      text: async () => 'Bad Request details',
      status: 400,
      statusText: 'Bad Request',
    } as Response);

    const result = await provider.generate(mockParams);

    expect(result.success).toBe(false);
    expect(result.names).toEqual([]);
    expect(result.message).toContain(
      'Cloudflare API request failed: 400 Bad Request'
    );
  });

  it('should parse response with malformed JSON (missing closing brace)', async () => {
    const mockApiResponse = {
      result: {
        response: '{\n  "names": [\n    "Malform1",\n    "Malform2"\n  ]\n',
      },
      success: true,
      errors: [],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await provider.generate({ ...mockParams, count: 2 });
    expect(result.success).toBe(true);
    expect(result.names).toEqual(['Malform1', 'Malform2']);
    expect(result.message).toContain('Parsed 2 names successfully via JSON');
  });

  it('should parse response with markdown code block fences', async () => {
    const mockApiResponse = {
      result: {
        response: '```json\n{"names": ["Fence1", "Fence2"]}\n```',
      },
      success: true,
      errors: [],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await provider.generate({ ...mockParams, count: 2 });
    expect(result.success).toBe(true);
    expect(result.names).toEqual(['Fence1', 'Fence2']);
    expect(result.message).toContain('Parsed 2 names successfully via JSON');
  });

  it('should use regex fallback for non-JSON response containing names', async () => {
    const mockApiResponse = {
      result: {
        response:
          'Here are the names: "Regex1", "Regex2", "Regex3" in an array like ["IgnoreMe"]',
      },
      success: true,
      errors: [],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await provider.generate(mockParams);
    expect(result.success).toBe(true);
    expect(result.names).toEqual(['Regex1', 'Regex2', 'Regex3']);
    // Note: The current regex might parse this differently, adjust test if needed based on actual regex behavior
    // This test assumes the simple quote regex catches it.
    expect(result.message).toContain(
      'Extracted 3 names via simple quote regex'
    );
  });

  it('should return failure if parsing completely fails', async () => {
    const mockApiResponse = {
      result: {
        response: 'No names here, just text.',
      },
      success: true,
      errors: [],
      messages: [],
    };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await provider.generate(mockParams);
    expect(result.success).toBe(false);
    expect(result.names).toEqual([]);
    expect(result.message).toContain('Cloudflare: Failed to parse response');
  });

  // Fix for the temperature test - ensure fetch is called before accessing mock.calls
  it('should calculate temperature correctly based on complexity', async () => {
    const complexities = [1, 2, 3, 4, 5];
    // Fix: Correct expected temperatures based on the formula
    const expectedTemps = [0.36, 0.47, 0.65, 0.83, 0.94];

    for (let i = 0; i < complexities.length; i++) {
      const complexity = complexities[i];
      const expectedTemp = expectedTemps[i];
      // Reset fetch mock for each iteration to check call count and args accurately
      // Use a fresh mock setup for fetch within the loop iteration
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: { response: JSON.stringify({ names: ['TempTest'] }) },
          success: true,
          errors: [],
          messages: [],
        }),
        text: async () => '{"names": ["TempTest"]}',
        status: 200,
        statusText: 'OK',
      } as Response);
      global.fetch = mockFetch; // Assign the specific mock for this iteration

      await provider.generate({ ...mockParams, complexity, count: 1 });

      // Check that fetch was called within this iteration
      expect(mockFetch).toHaveBeenCalledOnce();
      const fetchCall = mockFetch.mock.calls[0];
      // Ensure fetchCall and fetchCall[1] are defined before accessing body
      expect(fetchCall).toBeDefined();
      expect(fetchCall[1]).toBeDefined();

      const fetchCallBody = JSON.parse(fetchCall[1]?.body as string);
      expect(fetchCallBody.temperature).toBeCloseTo(expectedTemp, 2);
    }
    // Restore global fetch after the loop if necessary, though afterEach should handle it
    // global.fetch = vi.fn(); // Restore general mock if needed
  });
});
