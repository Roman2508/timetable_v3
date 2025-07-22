import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { ConfirmWindow } from "../../confirm-window";
import { dialogText } from "~/constants/dialogs-text";
import { ActionsDropdown } from "../../actions-dropdown";
import { deleteAuditory } from "~/store/auditories/auditories-async-actions";

interface IAuditoriesActionsProps {
  id: number;
}

const AuditoriesActions: React.FC<IAuditoriesActionsProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;
    const confirmed = await ConfirmWindow(dialogText.confirm.auditories.title, dialogText.confirm.auditories.text);
    if (confirmed) {
      dispatch(deleteAuditory(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/auditories/${id}`)}
    />
  );
};

export default AuditoriesActions;
