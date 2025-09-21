import { useMemo } from "react"
import { useSelector } from "react-redux"

import { sortByName } from "@/helpers/sort-by-name"
import { teachersSelector } from "@/store/teachers/teachers-slice"

const useTeacherFields = (variant = "default") => {
  const { teachersCategories } = useSelector(teachersSelector)

  const allFormFields = useMemo(
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

  if (variant === "default") return { teacherFormFields: allFormFields }

  const teacherFormFields = allFormFields.filter((el) =>
    ["lastName", "firstName", "middleName", "category"].includes(el.key),
  )

  return { teacherFormFields }
}

export default useTeacherFields
