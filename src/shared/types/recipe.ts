export type MealCategory = 'śniadanie' | 'drugie-śniadanie' | 'obiad' | 'kolacja' | 'przekąska';

export interface Ingredient {
  product: string;
  weight: number; // w gramach
  unit?: string; // np. "łyżka", "sztuka", "szklanka"
  quantity?: number; // np. 2 x łyżka
}

export interface Macros {
  calories: number; // K
  protein: number; // B
  fat: number; // T
  carbs: number; // WP - węglowodany prosta
  fiber: number; // F - włókno
  complexCarbs: number; // WW - węglowodany złożone
}

export interface Recipe {
  id: string;
  name: string;
  category: MealCategory;
  ingredients: Ingredient[];
  instructions: string[]; // kroki przygotowania
  tips?: string[];
  macros: Macros;
  preparationTime: number; // w minutach
}
