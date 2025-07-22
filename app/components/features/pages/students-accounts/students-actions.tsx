import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { ConfirmWindow } from "../../confirm-window";
import { dialogText } from "~/constants/dialogs-text";
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
    const confirmed = await ConfirmWindow(dialogText.confirm.students.title, dialogText.confirm.students.text);
    if (confirmed) {
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
