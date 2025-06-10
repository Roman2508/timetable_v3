export type CategoryModalStateType = {
  isOpen: boolean;
  actionType: "create" | "update";
};

export type UpdatingCategoryType = {
  id: number;
  name: string;
  shortName?: string;
};

export type StatusTypes = "Активний" | "Архів" | "";
