type ItemType = {
  name: string;
  [key: string]: any;
};

export const sortByName = (items?: ItemType[] | null): ItemType[] => {
  if (!items) return [];
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};
