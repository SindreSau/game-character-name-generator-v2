import { PoE2Class } from '@/types/name-generator';

type ClassInfo = {
  description: string;
  gender: 'masculine' | 'feminine' | 'neutral';
};

export const POE2_CLASS_DESCRIPTIONS: Record<PoE2Class, ClassInfo> = {
  Warrior: {
    description:
      'A mighty melee fighter who excels in combat with heavy armor and powerful weapons, drawing strength from physical prowess and battle techniques.',
    gender: 'masculine',
  },
  Sorceress: {
    description:
      'A powerful spellcaster who manipulates arcane energies, specializing in elemental magic that can devastate enemies from a distance.',
    gender: 'feminine',
  },
  Druid: {
    description:
      'A versatile nature-connected character who can shapeshift into beasts, command natural elements, and balance between offensive magic and physical attacks.',
    gender: 'neutral',
  },
  Rogue: {
    description:
      'A nimble and cunning combatant who excels in stealth, traps, and precise strikes, often using daggers and employing shadow magic.',
    gender: 'neutral',
  },
  Monk: {
    description:
      'A disciplined martial artist who harnesses inner spiritual energy to enhance physical capabilities, using bare hands and specialized weapons.',
    gender: 'masculine',
  },
  Huntress: {
    description:
      'A skilled archer and tracker who specializes in ranged combat, using bows and various types of arrows infused with different properties.',
    gender: 'feminine',
  },
  Necromancer: {
    description:
      'A dark magician who commands the dead, summons undead minions, and utilizes death and decay magic to weaken and destroy enemies.',
    gender: 'neutral',
  },
  Mercenary: {
    description:
      'A versatile combatant for hire, skilled in various weapons and combat techniques, motivated by gold and reputation rather than ideology.',
    gender: 'masculine',
  },
  Witch: {
    description:
      'A practitioner of forbidden magics who manipulates death and decay, summoning undead minions and casting powerful curses and chaos spells.',
    gender: 'feminine',
  },
  Ranger: {
    description:
      'A swift and precise archer who excels at ranged combat, using bows and traps to control the battlefield while maintaining distance from enemies.',
    gender: 'feminine',
  },
};

export function getClassDescription(characterClass: PoE2Class): string {
  if (!POE2_CLASS_DESCRIPTIONS[characterClass]) {
    console.warn(`No description found for class: ${characterClass}`);
    return `A character of the ${characterClass} class`;
  }
  return POE2_CLASS_DESCRIPTIONS[characterClass].description;
}

export function getClassGender(
  characterClass: PoE2Class
): 'masculine' | 'feminine' | 'neutral' {
  if (!POE2_CLASS_DESCRIPTIONS[characterClass]) {
    console.warn(`No gender preference found for class: ${characterClass}`);
    return 'neutral';
  }
  return POE2_CLASS_DESCRIPTIONS[characterClass].gender;
}
