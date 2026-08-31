import type { WeightUnit } from '@/shared/types/recipe';

export interface ShoppingListItem {
  id: string;
  product: string;
  weight: number;
  unit: WeightUnit;
  isChecked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  dates: string[];
  items: ShoppingListItem[];
  createdAt: string;
}
