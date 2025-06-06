import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { onConfirm } from "../../confirm-modal";
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

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити аудиторію?",
      description: `Аудиторія буде видалена назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (result) {
      dispatch(deleteAuditory(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      //   changeStatusFunction={() => {}}
      // changeCategoryFunction={() => {}}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/auditories/${id}`)}
    />
  );
};

export default AuditoriesActions;
