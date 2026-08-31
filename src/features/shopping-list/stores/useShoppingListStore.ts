import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ShoppingList, ShoppingListItem } from '../types/shoppingList';

interface ShoppingListStore {
  lists: ShoppingList[];
  addList: (name: string, dates: string[], items: ShoppingListItem[]) => string;
  updateList: (listId: string, name: string, dates: string[], items: ShoppingListItem[]) => void;
  removeList: (listId: string) => void;
  toggleItem: (listId: string, itemId: string) => void;
}

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set) => ({
      lists: [],
      addList: (name, dates, items) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const list: ShoppingList = {
          id,
          name,
          dates,
          items,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ lists: [list, ...state.lists] }));
        return id;
      },
      updateList: (listId, name, dates, items) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) {
              return list;
            }

            const checkedItemIds = new Set(
              list.items.filter((item) => item.isChecked).map((item) => item.id)
            );

            return {
              ...list,
              name,
              dates,
              items: items.map((item) => ({
                ...item,
                isChecked: checkedItemIds.has(item.id),
              })),
            };
          }),
        }));
      },
      removeList: (listId) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== listId),
        }));
      },
      toggleItem: (listId, itemId) => {
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) {
              return list;
            }

            return {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
              ),
            };
          }),
        }));
      },
    }),
    {
      name: 'shopping-lists-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
