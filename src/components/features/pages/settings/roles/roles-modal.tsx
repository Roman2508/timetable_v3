import { z } from "zod"
import { useRef, useMemo, useState, type FC, type Dispatch, type MouseEvent, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { useAppDispatch } from "@/store/store"
import EntityField from "../../../entity-field"
import type { UserRolesType } from "@/api/api-types"
import { dialogText } from "@/constants/dialogs-text"
import { Button } from "@/components/ui/common/button"
import { ConfirmWindow } from "../../../confirm-window"
import { deleteUser } from "@/store/auth/auth-async-actions"
import { Separator } from "@/components/ui/common/separator"
import { createRole, updateRole } from "@/store/roles/roles-async-actions"

const defaultFormData = {
  name: "",
  key: "",
}

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }),
  key: z.string({ message: "Це поле обов'язкове" }),
})

export type FormData = z.infer<typeof formSchema>

interface Props {
  isOpen: boolean
  modalType: "create" | "update"
  setIsOpen: Dispatch<SetStateAction<boolean>>
  editedRole: Omit<UserRolesType, "permissions"> | null
  setEditedRole: Dispatch<SetStateAction<Omit<UserRolesType, "permissions"> | null>>
}

const RolesModal: FC<Props> = ({ editedRole, isOpen, setIsOpen, modalType, setEditedRole }) => {
  const dispatch = useAppDispatch()

  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const formFields = useMemo(
    () => [
      {
        title: "Назва*",
        key: "name",
        text: "Публічна назва ролі",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Ключ*",
        key: "key",
        text: "Ключ ролі",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
    ],
    [],
  )

  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const formData = {
    ...defaultFormData,
    ...(editedRole ? { name: editedRole.name, key: editedRole.key } : {}),
    ...userFormData,
  }

  const validate = () => {
    const res = formSchema.safeParse(formData)
    if (res.success) return
    return res.error.format()
  }

  const errors = showErrors ? validate() : undefined

  const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsPending(true)

      const errors = validate()

      if (errors) {
        setShowErrors(true)
        return
      }

      if (modalType === "create") {
        await dispatch(createRole(formData))
        setIsOpen(false)
        return
      }
      if (modalType === "update" && editedRole) {
        await dispatch(updateRole({ ...formData, id: editedRole.id }))
        setIsOpen(false)
        setEditedRole(null)
      }
    } finally {
      setIsPending(false)
    }
  }

  const onSubmitClick = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }

  const onDeleteRole = async () => {
    if (!editedRole) return
    const confirmed = await ConfirmWindow(dialogText.confirm.accounts.title, dialogText.confirm.accounts.text)
    if (confirmed) {
      dispatch(deleteUser(editedRole.id))
    }
  }

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setUserFormData({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 !py-4 max-w-[600px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="flex items-center gap-1">
            {editedRole && modalType === "update" && editedRole.name}
            {modalType === "create" && "Нова роль"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription className="max-h-[75vh] overflow-y-auto">
          <form className="px-6 py-4" onSubmit={handleSubmit}>
            {formFields.map((input) => {
              const currentValue = formData[input.key as keyof FormData] as FormData[keyof FormData]

              return (
                <EntityField
                  {...input}
                  errors={errors}
                  isUpdate={false}
                  inputKey={input.key}
                  isEditable={!isPending}
                  labelClassNames="min-w-65"
                  classNames="flex-col gap-1"
                  currentValue={currentValue}
                  setUserFormData={setUserFormData}
                  inputType={input.inputType as "string" | "number"}
                  variant={input.variant as "input" | "select" | "button"}
                />
              )
            })}

            <button className="hidden" ref={submitButtonRef}></button>
          </form>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex items-center pt-4 px-4">
          {modalType === "update" && (
            <Button disabled={isPending} onClick={onDeleteRole} variant="destructive">
              Видалити
            </Button>
          )}

          <Button disabled={isPending} onClick={onSubmitClick}>
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RolesModal
