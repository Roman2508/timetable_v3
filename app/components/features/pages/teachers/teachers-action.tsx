import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { onConfirm } from "../../confirm-modal";
import { ActionsDropdown } from "../../actions-dropdown";
import { deleteTeacher } from "~/store/teachers/teachers-async-actions";

interface ITeachersActionsProps {
  id: number;
}

const TeachersActions: React.FC<ITeachersActionsProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити викладача?",
      description: `Викладача буде видалено назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (result) {
      dispatch(deleteTeacher(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      //   changeStatusFunction={() => {}}
      // changeCategoryFunction={() => {}}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/teachers/${id}`)}
    />
  );
};

export default TeachersActions;
