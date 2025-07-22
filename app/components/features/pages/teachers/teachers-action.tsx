import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { ConfirmWindow } from "../../confirm-window";
import { dialogText } from "~/constants/dialogs-text";
import { ActionsDropdown } from "../../actions-dropdown";
import { deleteTeacher } from "~/store/teachers/teachers-async-actions";

interface ITeachersActionsProps {
  id: number;
}

const TeachersActions: React.FC<ITeachersActionsProps> = ({ id, ...rest }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;
    const confirmed = await ConfirmWindow(dialogText.confirm.teachers.title, dialogText.confirm.teachers.text);
    if (confirmed) {
      dispatch(deleteTeacher(id));
    }
  };

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/teachers/${id}`)}
    />
  );
};

export default TeachersActions;
