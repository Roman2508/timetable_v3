import z from "zod"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Pencil, Plus, Trash2, User } from "lucide-react"
import { useMemo, useState, type FC, type MouseEvent } from "react"

import { useAppDispatch } from "~/store/store"
import { Card } from "~/components/ui/common/card"
import { sortByName } from "~/helpers/sort-by-name"
import { dialogText } from "~/constants/dialogs-text"
import { Button } from "~/components/ui/common/button"
import EntityField from "~/components/features/entity-field"
import EntityHeader from "~/components/features/entity-header"
import { teachersSelector } from "~/store/teachers/teachers-slice"
import { RootContainer } from "~/components/layouts/root-container"
import { getTeacherFullname } from "~/helpers/get-teacher-fullname"
import { ConfirmWindow } from "~/components/features/confirm-window"
import { createTeacher, deleteTeacher, updateTeacher } from "~/store/teachers/teachers-async-actions"

interface Props {
  teacherId: string
}

const initialFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
  calendarId: "",
  category: "",
  status: "Активний",
}

const requiredMessage = "Це поле обов'язкове"
const formSchema = z.object({
  firstName: z.string({ message: requiredMessage }).nonempty(requiredMessage),
  middleName: z.string({ message: requiredMessage }).nonempty(requiredMessage),
  lastName: z.string({ message: requiredMessage }).nonempty(requiredMessage),
  email: z.string({ message: requiredMessage }).email({ message: "Не вірний формат пошти" }),
  password: z.string().optional(), //
  calendarId: z.string().optional(),
  category: z.number({ message: requiredMessage }),
  status: z.enum(["Активний", "Архів"], { message: requiredMessage }),
})

// при создании пароль обязателен
// export const createTeacherSchema = formSchema.extend({
//   password: z.string().nonempty("Це поле обов'язкове"),
// })

// // при обновлении пароль не обязателен
// export const updateTeacherSchema = formSchema.extend({
//   password: z.string().optional(),
// })

export type FormData = z.infer<typeof formSchema>
// export type CreateTeacherData = z.infer<typeof createTeacherSchema>
// export type UpdateTeacherData = z.infer<typeof updateTeacherSchema>

const FullTeacher: FC<Props> = ({ teacherId }) => {
  const isUpdate = !isNaN(Number(teacherId))

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { teachersCategories, teacher } = useSelector(teachersSelector)

  const generalInformationFields = useMemo(
    () => [
      {
        title: "Прізвище*",
        key: "lastName",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Ім'я*",
        key: "firstName",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "По батькові*",
        key: "middleName",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Пошта*",
        key: "email",
        text: "Використовується для доступу до системи",
        isEditable: true,
        inputType: "email",
        variant: "input",
        items: [],
      },
      {
        title: "Пароль*",
        key: "password",
        text: "Використовується для доступу до системи",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Календар*",
        key: "calendarId",
        text: "Для автоматичного імпорту розкладу занять",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Статус*",
        key: "status",
        text: "Використовується для відображення або приховування викладача",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Активний", name: "Активний" },
          { id: "Архів", name: "Архів" },
        ],
      },
      {
        title: "Циклова комісія*",
        key: "category",
        text: "Циклова комісія до якої відноситься викладач",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: sortByName(teachersCategories),
      },
    ],
    [teachersCategories],
  )

  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [isPending, setIsPanding] = useState(false)

  const formData = {
    ...initialFormState,
    ...(teacher ? { ...teacher, category: teacher.category.id, email: teacher.user.email } : {}),
    ...userFormData,
  } as FormData

  const conditionalFormSchema = formSchema.superRefine((data, ctx) => {
    if (!isUpdate && !data.password) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Це поле обов'язкове",
      })
    }
  })

  const validate = () => {
    // const schema = isUpdate ? updateTeacherSchema : createTeacherSchema
    // const res = schema.safeParse(formData)

    const res = conditionalFormSchema.safeParse(formData)
    if (res.success) return
    return res.error.format()
  }

  const errors = showErrors ? validate() : undefined

  const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsPanding(true)
      const errors = validate()
      if (errors) {
        setShowErrors(true)
        return
      }

      if (isUpdate) {
        const { payload } = await dispatch(updateTeacher({ ...formData, id: Number(teacherId) }))
        if (payload) navigate("/teachers")

        return
      }

      const { payload } = await dispatch(createTeacher(formData))
      if (payload) navigate("/teachers")
    } finally {
      setIsPanding(false)
    }
  }

  const onDeleteTeacher = async () => {
    if (!isUpdate) return
    const confirmed = await ConfirmWindow(dialogText.confirm.teachers.title, dialogText.confirm.teachers.text)
    if (confirmed) {
      await dispatch(deleteTeacher(Number(teacher)))
      navigate("/teachers")
    }
  }

  return (
    <RootContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          {isUpdate && teacher ? (
            <EntityHeader Icon={User} label="ВИКЛАДАЧ" status={teacher.status} name={getTeacherFullname(teacher)} />
          ) : (
            <h2 className="flex items-center h-14 text-2xl font-semibold">Створити викладача</h2>
          )}

          <div className="flex gap-3">
            {isUpdate ? (
              <Button type="submit" disabled={!!errors || isPending}>
                <Pencil />
                Зберегти зміни
              </Button>
            ) : (
              <Button type="submit" disabled={!!errors || isPending}>
                <Plus />
                Створити викладача
              </Button>
            )}
          </div>
        </div>

        <Card className="px-10 pb-12 mb-10">
          <h3 className="text-xl font-semibold mb-5">Загальна інформація</h3>
          {generalInformationFields.map((input) => {
            const currentValue = formData[input.key as keyof FormData] as FormData[keyof FormData]

            return (
              <EntityField
                {...input}
                errors={errors}
                isUpdate={isUpdate}
                inputKey={input.key}
                currentValue={currentValue}
                setUserFormData={setUserFormData}
                inputType={input.inputType as "string" | "number"}
                variant={input.variant as "input" | "select" | "button"}
              />
            )
          })}
        </Card>
      </form>

      {isUpdate && (
        <Card className="px-10 pb-12 mb-6">
          <h3 className="text-xl font-semibold mb-5">Видалення викладача</h3>

          <div className="flex flex-col items-start gap-4 mb-4">
            <div>
              <p className="text-black/40 text-md">
                Викладач та все педагогічне навантаження пов'язане з ним будуть видалені назавжди.
              </p>
              <p className="text-black/40 text-md">Цю дію не можна відмінити.</p>
            </div>

            <Button variant="destructive" onClick={onDeleteTeacher}>
              <Trash2 />
              Видалити викладача
            </Button>
          </div>
        </Card>
      )}
    </RootContainer>
  )
}

export default FullTeacher
