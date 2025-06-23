type ItemFilterType = {
  status: "Всі" | "Активний" | "Архів";
  categories: { id: number }[];
  orderField: string;
  isOrderDesc: boolean;
};

export type GeneralSliceInitialState = {
  sidebar: {
    open: boolean;
    expandedItems: string[];
  };

  groups: ItemFilterType;
  auditories: ItemFilterType;
  teachers: ItemFilterType;
  plans: {
    status: "Всі" | "Активний" | "Архів";
    categories: { id: number }[];
    expanded: { id: number }[];
  };

  streams: { semesters: string };

  confirmModal: {
    isOpen: boolean;
    answer: boolean;
    title: string;
    itemName: string;
    description: string;
    onConfirm: () => void;
  };
  alertModal: {
    isOpen: boolean;
    title: string;
    text: string;
  };
};

export type ChangeConfirmDialogStateType = Partial<GeneralSliceInitialState["confirmModal"]>;
export type ChangeAlertDialogStateType = Partial<GeneralSliceInitialState["alertModal"]>;
