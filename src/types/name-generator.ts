export type NameAttributes = {
  length: number;
};

export type CharacterNameInput = {
  count?: number; // Number of names to generate
  genre: string; // Game genre (RPG, Fantasy, Sci-Fi, etc.)
  styles?: string[]; // Style descriptors (fire, elemental, ninja, etc.)
  gender?: 'neutral' | 'masculine' | 'feminine'; // Gender association for the name
  race?: string; // Character race (human, elf, dwarf, orc, etc.)
  complexity?: string | number; // How complex the name should be (1-10)
  length?: 'short' | 'medium' | 'long'; // Length of the name
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
