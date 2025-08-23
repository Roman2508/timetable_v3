import { useMemo } from "react"
import { useSelector } from "react-redux"

import { sortByName } from "~/helpers/sort-by-name"
import { groupsSelector } from "~/store/groups/groups-slice"
import type { GroupCategoriesType } from "~/store/groups/groups-types"

const useStudentFields = (variant = "default") => {
  const { groupCategories } = useSelector(groupsSelector)

  const allFormFields = useMemo(
    () => [
      {
        title: "ПІБ*",
        key: "name",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Логін*",
        key: "login",
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
        title: "Статус*",
        key: "status",
        text: "Використовується для відображення або приховування викладача",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Навчається", name: "Навчається" },
          { id: "Академічна відпустка", name: "Академічна відпустка" },
          { id: "Відраховано", name: "Відраховано" },
        ],
      },
      {
        title: "Група*",
        key: "group",
        text: "Група до якої відноситься студент",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: sortByName(groupCategories?.flatMap((el: GroupCategoriesType) => el.groups)),
      },
    ],
    [groupCategories],
  )

  if (variant === "default") return { studentFormFields: allFormFields }

  const studentFormFields = allFormFields.filter((el) => ["name", "login", "group"].includes(el.key))

  return { studentFormFields }
}

export default useStudentFields
