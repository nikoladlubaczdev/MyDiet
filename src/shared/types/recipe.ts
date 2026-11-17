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

export type Person = 'you' | 'partner';

export interface RecipeVariant {
  ingredients: Ingredient[];
  macros: Macros;
}

export interface Recipe extends RecipeVariant {
  id: string;
  name: string;
  categories: MealCategory[];
  instructions: string[]; // kroki przygotowania
  tips?: string[];
  prepTimeMinutes: number; // w minutach
  partnerVariant?: RecipeVariant;
}

export function getRecipeVariant(recipe: Recipe, person: Person): RecipeVariant {
  return person === 'partner' && recipe.partnerVariant ? recipe.partnerVariant : recipe;
}
