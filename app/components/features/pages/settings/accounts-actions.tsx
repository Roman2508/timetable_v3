import { type FC } from "react";

import { ConfirmWindow } from "../../confirm-window";
import { dialogText } from "~/constants/dialogs-text";
import { ActionsDropdown } from "../../actions-dropdown";

interface Props {
  id: number;
  onEditUser: (id: number) => void;
}

const AccountsActions: FC<Props> = ({ id, onEditUser }) => {
  const onClickDeleteUser = async (id: number) => {
    if (!id) return;
    const confirmed = await ConfirmWindow(dialogText.confirm.accounts.title, dialogText.confirm.accounts.text);
    if (confirmed) {
      alert("aaa");
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteUser}
      onClickUpdateFunction={(id) => onEditUser(id)}
    />
  );
};

export default AccountsActions;
