export type MealCategory = 'śniadanie' | 'drugie-śniadanie' | 'obiad' | 'kolacja' | 'kawa' | 'przekąska';

export interface Ingredient {
  product: string;
  weight: number; // w gramach
  quantity?: string; // np. "2 x Łyżka"
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
  category: MealCategory;
  description: string;
  ingredients: Ingredient[];
  instructions: string[]; // kroki przygotowania
  tips?: string[];
  macros: Macros;
  prepTimeMinutes: number; // w minutach
}
