import { useMemo } from "react";

type ItemType = {
  semester: number;
  [key: string]: any;
};

export function useItemsBySemesters<T extends Record<string, any>>(items: T[] | null, filters: { id: number }[]) {
  if (!items) return [];

  const visibleItems = useMemo(() => {
    return items.filter((el) => {
      return filters.some((f) => f.id === el.semester);
    });
  }, [items, filters]);

  return visibleItems;
}
