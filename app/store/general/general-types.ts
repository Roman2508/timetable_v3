export type ChangeConfirmDialogStateType = {
  isOpen?: boolean;
  answer?: boolean;
  title?: string;
  itemName?: string;
  description?: string;
  onConfirm?: () => void;
};

export type ChangeAlertDialogStateType = {
  isOpen?: boolean;
  title?: string;
  text?: string;
};
