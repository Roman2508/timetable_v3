import { LoadingStatusTypes } from "../app-types"

export type StudentsInitialState = {
  student: StudentType | null
  students: StudentType[] | null
  loadingStatus: LoadingStatusTypes
}

export type StudentType = {
  id: number
  name: string
  login: string
  password: string
  email: string
  status: "Навчається" | "Відраховано" | "Академічна відпустка"
  group: { id: number; name: string }
}
