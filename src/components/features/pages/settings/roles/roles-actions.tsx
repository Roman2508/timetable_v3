import { type FC } from "react"
import { KeyRound } from "lucide-react"

import { useAppDispatch } from "@/store/store"
import { dialogText } from "@/constants/dialogs-text"
import { clearRole } from "@/store/roles/roles-slice"
import { ConfirmWindow } from "../../../confirm-window"
import { ActionsDropdown } from "../../../actions-dropdown"
import { deleteRole, getFullRole } from "@/store/roles/roles-async-actions"

interface Props {
  id: number
  roleKey: string
  onEditUser: (id: number) => void
}

const RolesActions: FC<Props> = ({ id, roleKey, onEditUser }) => {
  const dispatch = useAppDispatch()

  const onClickDeleteUser = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.roles.title, dialogText.confirm.roles.text)
    if (confirmed) {
      dispatch(deleteRole(id))
    }
  }

  const checkIsDisabled = () => {
    return ["root_admin", "admin", "student", "teacher"].includes(roleKey)
  }

  return (
    <ActionsDropdown
      itemId={id}
      updateDisabled={checkIsDisabled()}
      deleteDisabled={checkIsDisabled()}
      onClickDeleteFunction={onClickDeleteUser}
      onClickUpdateFunction={(id) => onEditUser(id)}
      additionalItems={[
        {
          label: "Повноваження",
          onClick: (id) => {
            dispatch(clearRole())
            dispatch(getFullRole(id))
          },
          icon: <KeyRound />,
          disabled: checkIsDisabled(),
        },
      ]}
    />
  )
}

export default RolesActions
