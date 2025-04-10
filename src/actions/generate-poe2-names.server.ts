'use server';

import {
  PoE2CharacterInput,
  GenerateCharacterNamesReturnType,
} from '@/types/name-generator';
import {
  getClassDescription,
  getClassGender,
} from '@/utils/poe2-class-descriptions';
import { generateWithPoE2Fallback } from '@/utils/poe2-ai-providers';

export async function generatePoE2CharacterNames(
  input: PoE2CharacterInput
): GenerateCharacterNamesReturnType {
  try {
    const {
      count = 5,
      class: characterClass,
      elementalTags = [],
      additionalStyles = '',
    } = input;

    // Get class-specific information
    const classDescription = getClassDescription(characterClass);
    const gender = getClassGender(characterClass);

    // Create the elemental preferences string
    const elementalPreferences =
      elementalTags.length > 0
        ? `with primary affinity for ${elementalTags.join(', ')} element`
        : '';

    // Create the additional styles string
    const styles = additionalStyles
      ? `with these additional style characteristics: ${additionalStyles}`
      : '';

    // Construct the system prompt
    const systemPrompt = `
      You are a creative name generator specialized in creating character names for Path of Exile 2.
      You create unique, fitting names based on the character class, elemental affinity, and style preferences.
      Names should feel appropriate for the dark fantasy world of Path of Exile 2.
      Please use well known names from both the game and the lore as inspiration.
      Your task is to generate names that are unique, lore-appropriate, and memorable.

      Here are 20 example names (don't copy them exactly, but get inspired):
      Vexian Umbra
      Nyxael Stormcaller
      Obsidian Geist
      Silas Harrow
      Anya Vex
      Torvin Grimfang
      Lysandra Aethel
      Roric Nightfall
      Evelyn Scythe
      Zephyr Whisperwind
      Isara Frostmourn
      Kaelen Soulbinder
      Seraphina Raven
      Grimheart
      Lysandra Thorne
      Roric Ironclad
      Evelyn Shadow
      Zephyr Gale
      Isara Winter's End
      Torvin Stonegrave
      
      Generate original names that reflect the character's class identity and elemental preferences.
      Never include explanations, just respond with a well-formatted list of names.
    `;

    // Construct the user prompt
    const userPrompt = `
      Generate ${count} unique ${gender} character names for a Path of Exile 2 ${characterClass}.
      Class description: ${classDescription}
      ${elementalPreferences}
      ${styles}
      
      Make the names lore-appropriate, memorable and fitting for this class.
    `;

    // Generate names with Gemini first, fallback to Cloudflare
    const result = await generateWithPoE2Fallback({
      systemPrompt,
      userPrompt,
      count,
    });

    return {
      success: result.success,
      message: result.message,
      names: result.names,
      provider: result.provider,
    };
  } catch (error) {
    console.error('Error generating PoE2 character names:', error);
    return {
      success: false,
      message: `Error generating character names: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      names: [],
    };
  }
}
