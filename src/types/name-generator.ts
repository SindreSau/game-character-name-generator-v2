export type NameAttributes = {
  length: number;
};

export type CharacterNameInput = {
  count?: number; // Number of names to generate
  genre: string; // Game genre (RPG, Fantasy, Sci-Fi, etc.)
  styles?: string[]; // Style descriptors (fire, elemental, ninja, etc.)
  gender?: 'neutral' | 'masculine' | 'feminine'; // Gender association for the name
  complexity?: number; // How complex the name should be (1-10)
  length?: 'short' | 'medium' | 'long'; // Length of the name
  modelId?: string; // Added
  race?: string; // Added
  class?: string; // Added
  customInstructions?: string; // Added
};

export type GenerateCharacterNamesReturnType = Promise<{
  success: boolean;
  message: string;
  names: string[];
  provider?: string; // Optional field to indicate which provider was used
}>;

// Define form state types
export type FormInputs = {
  genre: string;
  styles: string;
  gender: 'neutral' | 'masculine' | 'feminine';
  complexity: number;
  length: 'short' | 'medium' | 'long';
};

// Define the resolved type from the Promise
export type ResolvedNameResult = Awaited<GenerateCharacterNamesReturnType>;

// Define form action result types
export type ActionResult =
  | {
      status: 'error';
      errors: { [K in keyof FormInputs]?: string[] };
      message?: string;
    }
  | { status: 'success'; data: ResolvedNameResult };

// Path of Exile 2 specific types
export type PoE2Class =
  | 'Warrior'
  | 'Sorceress'
  | 'Druid'
  | 'Rogue'
  | 'Monk'
  | 'Huntress'
  | 'Necromancer'
  | 'Mercenary'
  | 'Witch'
  | 'Ranger';

export type PoE2ElementalTag =
  | 'Fire'
  | 'Ice'
  | 'Lightning'
  | 'Chaos'
  | 'Physical'
  | 'Poison';

export type PoE2CharacterInput = {
  count?: number;
  class: PoE2Class;
  elementalTags: PoE2ElementalTag[];
  additionalStyles?: string; // Free text input for more descriptions
};

// PoE2 form types
export type PoE2FormInputs = {
  class: PoE2Class;
  elementalTags: PoE2ElementalTag[];
  additionalStyles: string;
};

// Action result type for PoE2
export type PoE2ActionResult =
  | {
      status: 'error';
      errors: { [K in keyof PoE2FormInputs]?: string[] };
      message?: string;
    }
  | { status: 'success'; data: ResolvedNameResult };
