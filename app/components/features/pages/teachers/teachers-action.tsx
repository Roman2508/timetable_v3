import React from "react";
import { useNavigate } from "react-router";

import { useAppDispatch } from "~/store/store";
import { onConfirm } from "../../confirm-modal";
import { ActionsDropdown } from "../../actions-dropdown";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import type { TeachersType } from "~/store/teachers/teachers-types";
import { deleteTeacher } from "~/store/teachers/teachers-async-actions";

interface ITeachersActionsProps {
  id: number;
}

const TeachersActions: React.FC<ITeachersActionsProps> = ({ id, ...rest }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return;

    const title = `Ви впевнені, що хочете видалити викладача:`;
    const description = "Викладач, буде видалений назавжди. Цю дію не можна відмінити.";
    const itemName = `${getTeacherFullname(rest as TeachersType)}?`;

    const confirmPayload = { isOpen: true, title, itemName, description };
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
