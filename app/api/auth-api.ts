import {
  type AuthResponseType,
  type LoginPayloadType,
  type RegisterPayloadType,
  type GetUsersPayloadType,
  type UpdateEditorDataType,
  type CreateUserPayloadType,
  type UpdateUserPayloadType,
  type GoogleLoginPayloadType,
} from "./api-types"
import { instanse } from "./api"
import { type UserType } from "../store/auth/auth-types"
import { type TeachersType } from "../store/teachers/teachers-types"

export const authAPI = {
  register(payload: RegisterPayloadType) {
    return instanse.post<AuthResponseType["user"]>("/auth/register", payload)
  },

  login(payload: LoginPayloadType) {
    return instanse.post<AuthResponseType>("/auth/login", payload)
  },

  googleLogin(payload: GoogleLoginPayloadType) {
    return instanse.post<AuthResponseType>("/auth/google/me", payload)
  },

  refresh() {
    return instanse.post<{ accessToken: string }>("/auth/refresh")
  },

  getProfile() {
    return instanse.get<AuthResponseType["user"]>("/auth/profile")
  },

  logout() {
    return instanse.post<boolean>("/auth/logout")
  },

  /* teacher data */
  updateTeacherBio(payload: UpdateEditorDataType) {
    const { id, data } = payload
    return instanse.patch<TeachersType>(`/teachers/bio/${id}`, data)
  },
  updateTeacherPrintedWorks(payload: UpdateEditorDataType) {
    const { id, data } = payload
    return instanse.patch<TeachersType>(`/teachers/printed-works/${id}`, data)
  },

  /* users */
  getUsers(payload: GetUsersPayloadType) {
    return instanse.get<[UserType[], number]>("/users", { params: payload })
  },
  createUser(payload: CreateUserPayloadType) {
    return instanse.post<UserType>("/users", payload)
  },
  updateUser(payload: UpdateUserPayloadType) {
    const { id, ...data } = payload
    return instanse.patch<UserType>(`/users/${id}`, data)
  },
  deleteUser(id: number) {
    return instanse.delete<number>(`/users/${id}`)
  },
}
