import React from "react";

export type ItemType = {
  status: "Активний" | "Архів";
  [key: string]: any;
};

type ReturnType = {
  filteredItems: ItemType[];
  counts: {
    all: number;
    active: number;
    archive: number;
  };
};

export function useItemsByStatus<T extends Record<string, any>>(
  items: T[] | null,
  targetKey: keyof T,
  status: string,
): ReturnType {
  const { filteredItems, counts } = React.useMemo(() => {
    if (!items) {
      return {
        filteredItems: [],
        counts: { all: 0, active: 0, archive: 0 },
      };
    }

    const allItems: ItemType[] = items.flatMap((item) => {
      const nested = item[targetKey];
      return Array.isArray(nested) ? nested : [];
    });

    const filteredItems = status === "Всі" ? allItems : allItems.filter((el) => el.status === status);

    const counts = {
      all: allItems.length,
      active: allItems.filter((el) => el.status === "Активний").length,
      archive: allItems.filter((el) => el.status === "Архів").length,
    };

    return { filteredItems, counts };
  }, [items, targetKey, status]);

  return { filteredItems, counts };
}
