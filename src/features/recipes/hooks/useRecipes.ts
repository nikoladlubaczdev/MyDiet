import { useMemo } from 'react';
import recipesData from '@/shared/data/recipes.json';
import { Recipe, MealCategory } from '@/shared/types/recipe';

interface UseRecipesOptions {
  category?: MealCategory;
  search?: string;
}

export function useRecipes(options?: UseRecipesOptions) {
  const recipes = useMemo(() => {
    let filtered: Recipe[] = recipesData.recipes;

    if (options?.category) {
      filtered = filtered.filter(recipe => recipe.category === options.category);
    }

    if (options?.search) {
      const query = options.search.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [options?.category, options?.search]);

  const categories = useMemo(() => {
    return Array.from(new Set(recipesData.recipes.map(r => r.category)));
  }, []);

  return {
    recipes,
    categories,
    totalCount: recipes.length,
  };
}
