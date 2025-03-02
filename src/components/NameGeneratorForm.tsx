'use client';

import { useState } from 'react';
import { generateCharacterNames } from '@/actions/get-names.server';
import type { CharacterNameInput } from '@/types/name-generator';

// Define genre options
const genreOptions = [
  'Fantasy',
  'Sci-Fi',
  'Historical',
  'Modern',
  'Post-Apocalyptic',
  'Cyberpunk',
  'Steampunk',
  'Horror',
  'Western',
  'Superhero',
];

// Define name style options
const styleOptions = [
  'Elegant',
  'Fierce',
  'Mysterious',
  'Ancient',
  'Noble',
  'Heroic',
  'Villainous',
  'Comic',
  'Foreign',
  'Magical',
];

export default function NameGeneratorForm() {
  // Form state
  const [formData, setFormData] = useState<CharacterNameInput>({
    genre: 'Fantasy',
    styles: ['Elegant'],
    race: '',
    complexity: 5,
    gender: 'neutral',
    count: 5,
    length: 'medium',
  });

  // Results state
  const [results, setResults] = useState<{
    names: string[];
    message: string;
    success: boolean;
    provider?: string;
  } | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes for multi-select
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      styles: selectedOptions,
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);

    try {
      // Use the server action
      const result = await generateCharacterNames(formData);
      setResults(result);
    } catch (error) {
      console.error('Error generating names:', error);
      setResults({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
        names: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Character Name Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Genre Selection */}
        <div className="form-group">
          <label htmlFor="genre" className="block text-sm font-medium mb-1">
            Genre *
          </label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Style Selection (Multi-select) */}
        <div className="form-group">
          <label htmlFor="styles" className="block text-sm font-medium mb-1">
            Name Styles * (Hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="styles"
            name="styles"
            multiple
            value={formData.styles}
            onChange={handleStyleChange}
            className="w-full p-2 border rounded-md h-32"
            required
          >
            {styleOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Race Input */}
        <div className="form-group">
          <label htmlFor="race" className="block text-sm font-medium mb-1">
            Race (Optional)
          </label>
          <input
            type="text"
            id="race"
            name="race"
            placeholder="e.g., Elf, Human, Alien"
            value={formData.race || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Gender Selection */}
        <div className="form-group">
          <label htmlFor="gender" className="block text-sm font-medium mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="neutral">Neutral</option>
            <option value="masculine">Masculine</option>
            <option value="feminine">Feminine</option>
          </select>
        </div>

        {/* Name Length */}
        <div className="form-group">
          <label htmlFor="length" className="block text-sm font-medium mb-1">
            Name Length
          </label>
          <select
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        {/* Complexity Slider */}
        <div className="form-group">
          <label
            htmlFor="complexity"
            className="block text-sm font-medium mb-1"
          >
            Complexity: {formData.complexity}
          </label>
          <input
            type="range"
            id="complexity"
            name="complexity"
            min="1"
            max="10"
            value={formData.complexity}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs">
            <span>Simple</span>
            <span>Complex</span>
          </div>
        </div>

        {/* Count Input */}
        <div className="form-group">
          <label htmlFor="count" className="block text-sm font-medium mb-1">
            Number of Names
          </label>
          <input
            type="number"
            id="count"
            name="count"
            min="1"
            max="100"
            value={formData.count}
            onChange={handleNumberChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Generating Names...' : 'Generate Names'}
        </button>
      </form>

      {/* Results Display */}
      {results && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          {results.provider && (
            <p className="text-sm text-gray-500 mb-2">
              AI Provider: {results.provider}
            </p>
          )}
          <p
            className={`mb-4 ${
              results.success ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {results.message}
          </p>

          {results.names.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Generated Names:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {results.names.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
