import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { onConfirm } from "../../confirm-modal";
import { ActionsDropdown } from "../../actions-dropdown";
import { deleteStudent } from "~/store/students/students-async-actions";

interface IStudentsActionsProps {
  id: number;
}

const StudentsActions: React.FC<IStudentsActionsProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити студента?",
      description: `Студент та всі результати навчання пов'язані з ним будуть видалені назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (result) {
      dispatch(deleteStudent(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/students/${id}`)}
    />
  );
};

export default StudentsActions;
