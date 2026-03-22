export interface CharacterAbility {
  name: string;
  nameEn: string;
  description: string;
}

export interface CharacterStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CharacterSavingThrows {
  str: boolean;
  dex: boolean;
  con: boolean;
  int: boolean;
  wis: boolean;
  cha: boolean;
}

export interface Character {
  id: string;
  name: string;
  name_en: string;
  title: string;
  title_en: string;
  race: string;
  age: string;
  height: string;
  weight: string;
  class: string;
  affiliation: string;
  origin: string;
  specialty: string[];
  weakness: string[];
  motto: string;
  motto_en: string;
  personality: string;
  background: string;
  stats: CharacterStats;
  stat_saving_throws: CharacterSavingThrows;
  proficiency_bonus: number;
  abilities: CharacterAbility[];
  image: string;
  hero_image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
