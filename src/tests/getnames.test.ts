import {
  CharacterNameInput,
  generateCharacterNames,
} from '@/actions/get-names.server';
import { test, expect, assertType } from 'vitest';

test('getNames returns correct type', async () => {
  const count = 5;

  const result = await generateCharacterNames({
    genre: 'fantasy',
    styles: ['medieval', 'nordic', 'brute'],
    complexity: 2,
    count: count,
    gender: 'neutral',
    race: 'human',
  });

  console.log(result);

  assertType<{ success: boolean; message: string; names: string[] }>(result);
  expect(result.success).toBe(true);
  expect(result.message).toBeDefined();
  expect(result.names).toHaveLength(count);
});

test('getNames works well with various inputs', async () => {
  const inputs: CharacterNameInput[] = [
    {
      genre: 'sci-fi',
      styles: ['futuristic', 'technological', 'space', 'alien'],
      race: 'human',
      length: 'short',
      complexity: 6,
      gender: 'neutral',
      count: 4,
    },
    {
      genre: 'fantasy',
      styles: ['fire', 'magical'],
      race: 'elf',
      complexity: 7,
      gender: 'feminine',
      count: 5,
    },
    {
      genre: 'cyberpunk',
      styles: ['digital', 'rebellious', 'street'],
      race: 'human',
      length: 'long',
      complexity: 2,
      gender: 'neutral',
      count: 6,
    },
    {
      genre: 'horror',
      styles: ['demonic'],
      race: 'monster',
      length: 'short',
      complexity: 8,
      gender: 'neutral',
      count: 7,
    },
    {
      genre: 'mythology',
      styles: ['epic', 'heroic'],
      race: 'god',
      complexity: 3,
      gender: 'masculine',
      count: 8,
    },

    {
      genre: 'historical',
      styles: ['regal', 'traditional', 'noble', 'british', 'royal'],
      race: 'human',
      length: 'short',
      complexity: 5,
      gender: 'neutral',
      count: 10,
    },
  ];

  const results = await Promise.all(
    inputs.map((input) => generateCharacterNames(input))
  );

  results.forEach((result) => {
    expect(result.success).toBe(true);
  });

  console.log(results.map((result) => result.names));
}, 15000);

test('getNames returns error message for invalid input', async () => {
  const result = await generateCharacterNames({
    genre: '',
    styles: [],
  });

  console.log(result);

  expect(result.success).toBe(false);
  expect(result.message).toBeDefined();
  expect(result.names).toHaveLength(0);
});

test('generateCharacterNames works with Cloudflare failure', async () => {
  const result = await generateCharacterNames(
    {
      genre: 'fps',
      styles: ['military', 'american', 'call of duty'],
      complexity: 1,
      count: 1,
      gender: 'neutral',
      length: 'medium',
      race: 'human',
    },
    true
  );

  console.log(result);

  expect(result.success).toBe(true);
  expect(result.message).toBeDefined();
});
