import { type FC } from "react"

import { useAppDispatch } from "@/store/store"
import { dialogText } from "@/constants/dialogs-text"
import { ConfirmWindow } from "../../../confirm-window"
import { ActionsDropdown } from "../../../actions-dropdown"
import { deleteUser } from "@/store/auth/auth-async-actions"

interface Props {
  id: number
  onEditUser: (id: number) => void
}

const AccountsActions: FC<Props> = ({ id, onEditUser }) => {
  const dispatch = useAppDispatch()

  const onClickDeleteUser = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.accounts.title, dialogText.confirm.accounts.text)
    if (confirmed) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteUser}
      onClickUpdateFunction={(id) => onEditUser(id)}
    />
  )
}

export default AccountsActions
