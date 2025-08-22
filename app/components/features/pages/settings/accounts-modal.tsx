import { z } from "zod"
import { useSelector } from "react-redux"
import { useMemo, useRef, useState, type Dispatch, type FC, type MouseEvent, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog"
import EntityField from "../../entity-field"
import { useAppDispatch } from "~/store/store"
import { sortByName } from "~/helpers/sort-by-name"
import { Button } from "~/components/ui/common/button"
import type { UserType } from "~/store/auth/auth-types"
import { rolesSelector } from "~/store/roles/roles-slice"
import { Separator } from "~/components/ui/common/separator"
import { createUser, updateUser } from "~/store/auth/auth-async-actions"

const defaultFormData = {
  name: "",
  email: "",
  password: "",
  roles: [],
}

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }),
  email: z.string({ message: "Це поле обов'язкове" }),
  password: z.string({ message: "Це поле обов'язкове" }).optional(),
  roles: z.array(z.string()).min(1, "Оберіть хоча б один варіант"),
})

export type FormData = z.infer<typeof formSchema>

interface Props {
  isOpen: boolean
  user: UserType | null
  modalType: "create" | "update"
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AccountsModal: FC<Props> = ({ user, isOpen, setIsOpen, modalType }) => {
  const dispatch = useAppDispatch()

  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const { roles } = useSelector(rolesSelector)

  const formFields = useMemo(
    () => [
      {
        title: "ПІБ*",
        key: "name",
        text: "Прізвище, ім'я та побатькові користувача",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Пошта*",
        key: "email",
        text: "Адреса електронної пошти для доступу до свого облікового запису",
        isEditable: true,
        inputType: "email",
        variant: "input",
        items: [],
      },
      {
        title: "Пароль*",
        key: "password",
        text: "Пароль користувача для доступу до свого облікового запису",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Ролі*",
        key: "roles",
        text: "Використовується для дозволу проводити дії на платформі",
        isEditable: true,
        inputType: "text",
        variant: "multi-select",
        items: sortByName(roles),
      },
    ],
    [],
  )

  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const formData = {
    ...defaultFormData,
    ...(user ? { ...user, roles: user.roles.map((el) => String(el.id)) } : {}),
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
        const roles = (formData.roles || []).map((el) => +el)
        await dispatch(createUser({ ...formData, roles }))
        setIsOpen(false)
        return
      }
      if (modalType === "update" && user) {
        const roles = (formData.roles || []).map((el) => +el)
        await dispatch(updateUser({ ...formData, roles, id: user.id }))
        setIsOpen(false)
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

  // console.log(formData)

  const deleteSemesterConfirmation = async () => {
    alert("Якщо раніше був вибраний план - перевіряю чи не вибрано інший")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="px-0 !py-4 max-w-[600px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="flex items-center gap-1">
            {user && modalType === "update" && user.name}
            {modalType === "create" && "Новий користувач"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
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
            <Button disabled={isPending} onClick={deleteSemesterConfirmation} variant="destructive">
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

export default AccountsModal
