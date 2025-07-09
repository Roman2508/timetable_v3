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
      description: `Студент, включаючи всі результати навчання, будуть видалені назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (result) {
      dispatch(deleteStudent(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      //   changeStatusFunction={() => {}}
      // changeCategoryFunction={() => {}}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/groups/${id}`)}
    />
  );
};

export default StudentsActions;
