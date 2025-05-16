import React from "react";

type ItemType = { status: "Активний" | "Архів"; [key: string]: any };
type GenericObject = Record<string, any>;

export function useItemsByStatus<T extends GenericObject>(items: T[], key: keyof T, status: string): any[] {
  const [internalItems, setInternalItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    setInternalItems(items);
  }, [items]);

  const filteredNestedItems = React.useMemo(() => {
    return internalItems.flatMap((item) => {
      const nestedArray = item[key];
      if (!Array.isArray(nestedArray)) return [];

      if (status === "Всі") {
        return nestedArray;
      }

      return nestedArray.filter((nestedItem: ItemType) => nestedItem?.status === status);
    });
  }, [internalItems, key, status]);

  return filteredNestedItems;
}
