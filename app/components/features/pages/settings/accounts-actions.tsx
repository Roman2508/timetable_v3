import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { ConfirmWindow } from "../../confirm-window";
import { dialogText } from "~/constants/dialogs-text";
import { ActionsDropdown } from "../../actions-dropdown";
import { deleteAuditory } from "~/store/auditories/auditories-async-actions";

interface Props {
  id: number;
}

const AccountsActions: React.FC<Props> = ({ id }) => {
  const dispatch = useAppDispatch();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;
    const confirmed = await ConfirmWindow(dialogText.confirm.accounts.title, dialogText.confirm.accounts.text);
    if (confirmed) {
      dispatch(deleteAuditory(id));
    }
  };

  return <ActionsDropdown itemId={id} onClickDeleteFunction={onClickDeleteCategory} onClickUpdateFunction={() => {}} />;
};

export default AccountsActions;
