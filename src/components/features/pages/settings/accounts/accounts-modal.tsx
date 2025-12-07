import { z } from "zod"
import { toast } from "sonner"
import { useSelector } from "react-redux"
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
import { sortByName } from "@/helpers/sort-by-name"
import { dialogText } from "@/constants/dialogs-text"
import { Button } from "@/components/ui/common/button"
import { ConfirmWindow } from "../../../confirm-window"
import type { UserType } from "@/store/auth/auth-types"
import { rolesSelector } from "@/store/roles/roles-slice"

import { Separator } from "@/components/ui/common/separator"
import useTeacherFields from "@/hooks/form/use-teacher-fields"
import useStudentFields from "@/hooks/form/use-student-fields"
import { createUser, deleteUser, updateUser } from "@/store/auth/auth-async-actions"

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
  setEditedUser: Dispatch<SetStateAction<UserType | null>>
}

const findRole = (roles: { id: number; name: string }[], wantedRoleIds: string[], wantedRoleName: string) => {
  const wantedRole = roles.find((el) => el.name === wantedRoleName)

  if (!wantedRole) return false

  const roleSelected = wantedRoleIds.find((id) => +id === wantedRole.id)

  if (roleSelected) {
    return true
  }
  return false
}

const setAvailableRoles = (roles: { id: number; name: string }[], wantedRoleIds: string[]) => {
  const teacherRole = roles.find((el) => el.name === "Викладач")
  const studentRole = roles.find((el) => el.name === "Студент")

  if (!teacherRole || !studentRole) return wantedRoleIds

  const teacherId = String(teacherRole.id)
  const studentId = String(studentRole.id)

  const hasTeacher = wantedRoleIds.includes(teacherId)
  const hasStudent = wantedRoleIds.includes(studentId)

  if (hasTeacher && hasStudent) {
    toast.info('Для користувача одночасно можна вибрати роль "Викладач" або "Студент"', { duration: 5000 })
    // ищем, кто идёт первым в списке
    const firstIndexTeacher = wantedRoleIds.indexOf(teacherId)
    const firstIndexStudent = wantedRoleIds.indexOf(studentId)

    if (firstIndexTeacher < firstIndexStudent) {
      // "Викладач" идёт раньше → убираем "Студент"
      return wantedRoleIds.filter((id) => id !== studentId)
    } else {
      // "Студент" идёт раньше → убираем "Викладач"
      return wantedRoleIds.filter((id) => id !== teacherId)
    }
  }

  return wantedRoleIds
}

const AccountsModal: FC<Props> = ({ user, isOpen, setIsOpen, modalType, setEditedUser }) => {
  const dispatch = useAppDispatch()

  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const { roles } = useSelector(rolesSelector)

  const onChangeRole = (selectedRoles: string[]) => {
    setUserFormData((prev) => ({ ...prev, roles: setAvailableRoles(roles || [], selectedRoles) }))
  }

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
        onChange: onChangeRole,
        items: sortByName(roles),
      },
    ],
    [],
  )

  const { teacherFormFields } = useTeacherFields("small")
  const { studentFormFields } = useStudentFields("small")

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

  const onDeleteUser = async () => {
    if (!user) return
    const confirmed = await ConfirmWindow(dialogText.confirm.accounts.title, dialogText.confirm.accounts.text)
    if (confirmed) {
      dispatch(deleteUser(user.id))
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
          <DialogTitle className="flex items-center gap-1 text-xl font-bold tracking-tight">
            {user && modalType === "update" && user.name}
            {modalType === "create" && "Новий користувач"}
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

            {/*  */}

            {findRole(roles || [], formData.roles, "Викладач") && (
              <>
                <Separator />
                <h3 className="font-bold text-xl my-4">Викладач</h3>
                {teacherFormFields.map((input) => {
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
              </>
            )}

            {/*  */}

            {findRole(roles || [], formData.roles, "Студент") && (
              <>
                <Separator />
                <h3 className="font-bold text-xl my-4">Студент</h3>
                {studentFormFields.map((input) => {
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
              </>
            )}

            <button className="hidden" ref={submitButtonRef}></button>
          </form>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex items-center pt-4 px-4">
          {modalType === "update" && (
            <Button disabled={isPending} onClick={onDeleteUser} variant="destructive">
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
