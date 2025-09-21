type ItemType = {
  id: number | string;
  name: string;
  [key: string]: any;
};

export const sortById = (items?: ItemType[] | null): ItemType[] => {
  if (!items) return [];
  return [...items].sort((a, b) => Number(a.id) - Number(b.id));
};
