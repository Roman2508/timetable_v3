import React from "react";

type ItemType = {
  status: "Активний" | "Архів";
  [key: string]: any;
};

export function useItemsByStatus<T extends Record<string, any>>(
  items: T[] | null,
  targetKey: keyof T,
  status: string,
): any[] {
  if (!items) return [];

  const filteredItems = React.useMemo(() => {
    return items.flatMap((item) => {
      const nestedArray = item[targetKey];
      if (!Array.isArray(nestedArray)) return [];

      if (status === "Всі") {
        return nestedArray;
      }

      return nestedArray.filter((nestedItem: ItemType) => nestedItem?.status === status);
    });
  }, [items, targetKey, status]);

  return filteredItems;
}
