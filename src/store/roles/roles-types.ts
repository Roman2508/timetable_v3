import type { UserRolesType } from "@/api/api-types"
import { LoadingStatusTypes } from "../app-types"

export type RolesInitialState = {
  roles: Omit<UserRolesType, "permissions">[] | null
  role: UserRolesType | null
  loadingStatus: LoadingStatusTypes
}

export type RoleType = {
  id: number
  name: string
  key: string
  users: number
}
