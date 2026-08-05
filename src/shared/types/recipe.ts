export type MealCategory = 'ś' | 'o' | 'k' | 'p' | 'sm';

export type WeightUnit = 'g' | 'ml';

export interface Ingredient {
  product: string;
  weight: number;
  unit: WeightUnit;
  hint?: string; // np. "0.5 x Szklanka", "2 x Łyżka"
}

export interface Macros {
  K: number; // kalorie
  B: number; // białko
  T: number; // tłuszcze
  WP: number; // węglowodany proste
  F: number; // włókno
  WW: number; // węglowodany złożone
}

export interface Recipe {
  id: string;
  name: string;
  categories: MealCategory[];
  ingredients: Ingredient[];
  instructions: string[]; // kroki przygotowania
  tips?: string[];
  macros: Macros;
  prepTimeMinutes: number; // w minutach
}
