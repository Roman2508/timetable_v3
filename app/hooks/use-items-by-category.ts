import { useMemo } from "react";

type ItemType = {
  category: { id: number; name: string; [key: string]: any };
  [key: string]: any;
};

export function useItemsByCategory<T extends Record<string, any>>(items: T[] | null, filters: { id: number }[]) {
  if (!items) return [];

  const visibleItems = useMemo(() => {
    return items.filter((el) => {
      return filters.some((f) => f.id === el.category.id);
    });
  }, [items, filters]);

  return visibleItems;
}
