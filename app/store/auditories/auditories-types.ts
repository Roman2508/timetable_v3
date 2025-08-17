import { LoadingStatusTypes } from "../app-types"

export type AuditoriesInitialState = {
  auditoriCategories: AuditoryCategoriesTypes[] | null
  auditory: AuditoriesTypes | null
  loadingStatus: LoadingStatusTypes
}

export type AuditoryCategoriesTypes = {
  id: number
  name: string
  shortName: string
  auditories: AuditoriesTypes[]
}

export type AuditoriesTypes = {
  id: number
  name: string
  seatsNumber: number
  status: "Активний" | "Архів"
  category: { id: number; name: string }
}
