import { type FC } from "react"

import { useAppDispatch } from "~/store/store"
import { ConfirmWindow } from "../../../confirm-window"
import { dialogText } from "~/constants/dialogs-text"
import { ActionsDropdown } from "../../../actions-dropdown"
import { deleteUser } from "~/store/auth/auth-async-actions"
import { KeyRound } from "lucide-react"

interface Props {
  id: number
  onEditUser: (id: number) => void
}

const RolesActions: FC<Props> = ({ id, onEditUser }) => {
  const dispatch = useAppDispatch()

  const onClickDeleteUser = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.roles.title, dialogText.confirm.roles.text)
    if (confirmed) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <ActionsDropdown
      itemId={id}
      onClickDeleteFunction={onClickDeleteUser}
      onClickUpdateFunction={(id) => onEditUser(id)}
      additionalItems={[{ label: "Оновити дозволи", onClick: () => {}, icon: <KeyRound /> }]}
    />
  )
}

export default RolesActions
