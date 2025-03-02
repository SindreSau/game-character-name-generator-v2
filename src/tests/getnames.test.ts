import { generateCharacterNames } from '@/actions/get-names';
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
