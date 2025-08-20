type ItemFilterType = {
  status: "Всі" | "Активний" | "Архів"
  categories: { id: number }[]
  orderField: string
  isOrderDesc: boolean
}

export type StudentsStatusType = "Всі" | "Навчається" | "Відраховано" | "Академічна відпустка"

export type GeneralSliceInitialState = {
  sidebar: { open: boolean; expandedItems: string[] }

  groups: ItemFilterType
  auditories: ItemFilterType
  teachers: ItemFilterType
  plans: {
    status: "Всі" | "Активний" | "Архів"
    categories: { id: number }[]
    expanded: { id: number }[]
  }

  students: { status: StudentsStatusType }

  streams: { semesters: string }

  timetable: {
    semester: number | null
    week: number | null
    item: number | null
    category: number | null
    type: string | null
  }
}
