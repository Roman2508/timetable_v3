import React from "react"
import { useNavigate } from "react-router"

import { useAppDispatch } from "@/store/store"
import { ConfirmWindow } from "../../confirm-window"
import { dialogText } from "@/constants/dialogs-text"
import { ActionsDropdown } from "../../actions-dropdown"
import { deleteGroup } from "@/store/groups/groups-async-actions"

interface IGroupActionsProps {
  id: number
}

const GroupActions: React.FC<IGroupActionsProps> = ({ id }) => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const onClickDeleteCategory = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.groups.title, dialogText.confirm.groups.text)

    if (confirmed) {
      dispatch(deleteGroup(id))
    }
  }

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteCategory}
      onClickUpdateFunction={() => navigate(`/groups/${id}`)}
    />
  )
}

export default GroupActions
