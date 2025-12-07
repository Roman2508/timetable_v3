import type { UserRolesType } from "@/api/api-types"
import { LoadingStatusTypes } from "../app-types"
import { type StudentType } from "../students/students-types"
import { type TeachersType } from "../teachers/teachers-types"

export type AuthInitialState = {
  user: UserType | null
  users: UserType[] | null
  loadingStatus: LoadingStatusTypes
}

export const UserRoles = {
  ROOT_ADMIN: "ROOT_ADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  METHODIST: "METHODIST",
  GUEST: "GUEST",
}

export type UserRolesKeysType = (typeof UserRoles)[keyof typeof UserRoles]
/* 
id: 1
key: "root_admin"
name: "Головний адміністратор"
permissions: []
*/
export type UserType = {
  id: number
  login: string // ??????
  name: string
  email: string
  roles: UserRolesType[]
  picture: string | null
  lastLogin: string | null
  createdAt: string | null
  teacher: TeachersType | null
  student: StudentType | null
}

export const userRoles = ["ADMIN", "GUEST", "TEACHER", "STUDENT", "HEAD_OF_DEPARTMENT", "METHODIST"] as const
