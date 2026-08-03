import { useMemo } from 'react';
import recipesData from '@/shared/data/recipes.json';
import { Recipe, MealCategory } from '@/shared/types/recipe';

interface UseRecipesOptions {
  category?: MealCategory;
  search?: string;
}

export function useRecipes(options?: UseRecipesOptions) {
  const recipes = useMemo(() => {
    let filtered: Recipe[] = (recipesData.recipes as Recipe[]);

    if (options?.category) {
      filtered = filtered.filter(recipe => 
        (recipe.categories as MealCategory[]).includes(options.category!)
      );
    }

    if (options?.search) {
      const query = options.search.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [options?.category, options?.search]);

  const categories = useMemo(() => {
    const cats = new Set<MealCategory>();
    recipesData.recipes.forEach((r: any) => {
      (r.categories as MealCategory[]).forEach(c => cats.add(c));
    });
    return Array.from(cats).sort();
  }, []);

  return {
    recipes,
    categories,
    totalCount: recipes.length,
  };
}
