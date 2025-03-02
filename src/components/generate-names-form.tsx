'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCharacterNames } from '@/actions/get-names.server';
import { CharacterNameInput } from '@/types/name-generator';
import { Copy } from 'lucide-react';

// Define a type for the resolved value
type ResolvedGenerateCharacterNamesReturnType = {
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
};

// Define validation schema with Zod
const formSchema = z.object({
  genre: z.string().min(1, 'Genre is required'),
  styles: z.string(),
  complexity: z.coerce.number().min(1).max(10).default(5),
  gender: z.enum(['neutral', 'masculine', 'feminine']).default('neutral'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

type FormValues = z.infer<typeof formSchema>;

// Predefined options for form selects
const GENRE_OPTIONS = [
  'Fantasy',
  'Sci-Fi',
  'Historical',
  'Modern',
  'Cyberpunk',
  'Steampunk',
  'Horror',
  'Western',
];

const GenerateNamesForm = () => {
  // Use the resolved type for state
  const [result, setResult] =
    useState<ResolvedGenerateCharacterNamesReturnType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: '',
      styles: '',
      complexity: 5,
      gender: 'neutral',
      length: 'medium',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Convert comma-separated string to array and trim each value
      const stylesArray = data.styles
        .split(',')
        .map((style) => style.trim())
        .filter((style) => style.length > 0);

      const input: CharacterNameInput = {
        ...data,
        styles: stylesArray,
        race: 'human', // Default race
      };

      // Await the promise and cast its resolved value.
      const response = await generateCharacterNames(input);
      setResult(
        response as unknown as ResolvedGenerateCharacterNamesReturnType
      );
    } catch (error) {
      console.error('Error generating names:', error);
      const errorResult: ResolvedGenerateCharacterNamesReturnType = {
        success: false,
        message: 'An unexpected error occurred',
        names: [],
      };
      setResult(errorResult);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400">
          Character Name Generator
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full md:w-1/2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            >
              {/* Genre Field */}
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Genre <span className="text-emerald-400">*</span>
                </label>
                <select
                  id="genre"
                  {...register('genre')}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a genre</option>
                  {GENRE_OPTIONS.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.genre.message}
                  </p>
                )}
              </div>

              {/* Styles Field */}
              <div>
                <label
                  htmlFor="styles"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Styles <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  id="styles"
                  {...register('styles')}
                  placeholder="Elegant, Mysterious, Epic (comma separated)"
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.styles && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.styles.message}
                  </p>
                )}
              </div>

              {/* Gender Toggle */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Gender Leaning
                </label>
                <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
                  {['neutral', 'masculine', 'feminine'].map((option) => (
                    <label
                      key={option}
                      className="flex-1 text-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        {...register('gender')}
                        value={option}
                        className="sr-only"
                      />
                      <div
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-all ${
                          watch('gender') === option
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name Length Toggle */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Name Length
                </label>
                <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
                  {['short', 'medium', 'long'].map((option) => (
                    <label
                      key={option}
                      className="flex-1 text-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        {...register('length')}
                        value={option}
                        className="sr-only"
                      />
                      <div
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-all ${
                          watch('length') === option
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Complexity Slider */}
              <div className="pt-4">
                <label
                  htmlFor="complexity"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Complexity:{' '}
                  <span className="text-emerald-400">
                    {watch('complexity')}
                  </span>
                </label>
                <input
                  type="range"
                  id="complexity"
                  min="1"
                  max="10"
                  step="1"
                  {...register('complexity')}
                  className="w-full accent-emerald-400"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Names'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Generated Names
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-16 w-16 border-t-2 border-b-2 border-emerald-400 rounded-full"></div>
                </div>
              ) : result ? (
                <div>
                  {result.success ? (
                    result.names && result.names.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {result.names.map((name: string, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-all"
                          >
                            <span className="text-lg text-gray-100">
                              {name}
                            </span>
                            <button
                              onClick={() => copyToClipboard(name, index)}
                              className="p-2 text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === index ? (
                                <span className="text-emerald-400 text-sm">
                                  Copied!
                                </span>
                              ) : (
                                <Copy size={18} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No names were generated.</p>
                    )
                  ) : (
                    <div className="text-red-400 p-4 border border-red-800 bg-red-900/30 rounded-lg">
                      <p className="font-medium">Error</p>
                      <p>{result.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-lg">
                  <p className="text-gray-500 text-center mb-2">
                    Fill out the form and generate some character names
                  </p>
                  <div className="text-5xl text-blue-500 mb-4">🎮</div>
                  <p className="text-gray-600 text-sm text-center">
                    Perfect for your next game, story, or RPG character
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateNamesForm;
