import {
  AuthResponseType,
  LoginPayloadType,
  RegisterPayloadType,
  UpdateEditorDataType,
  GoogleLoginPayloadType,
  UpdateUserPayloadType,
  CreateUserPayloadType,
  GetUsersPayloadType,
} from "./apiTypes";
import { instanse } from "./api";
import { TeachersType } from "../store/teachers/teachers-types";
import { UserType } from "../store/auth/auth-types";

export const authAPI = {
  register(payload: RegisterPayloadType) {
    return instanse.post<AuthResponseType>("/auth/register", payload);
  },

  login(payload: LoginPayloadType) {
    return instanse.post<AuthResponseType>("/auth/login", payload);
  },

  googleLogin(payload: GoogleLoginPayloadType) {
    return instanse.post<AuthResponseType>("/auth/google/me", payload);
  },

  getMe(token: string) {
    return instanse.post<AuthResponseType>("/auth/me", { token });
  },

  /* teacher data */
  updateTeacherBio(payload: UpdateEditorDataType) {
    const { id, data } = payload;
    return instanse.patch<TeachersType>(`/teachers/bio/${id}`, data);
  },
  updateTeacherPrintedWorks(payload: UpdateEditorDataType) {
    const { id, data } = payload;
    return instanse.patch<TeachersType>(`/teachers/printed-works/${id}`, data);
  },

  /* users */
  getUsers(payload: GetUsersPayloadType) {
    return instanse.get<[UserType[], number]>("/users", { params: payload });
  },
  createUser(payload: CreateUserPayloadType) {
    return instanse.post<UserType>("/users", payload);
  },
  updateUser(payload: UpdateUserPayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<UserType>(`/users/${id}`, data);
  },
  deleteUser(id: number) {
    return instanse.delete<number>(`/users/${id}`);
  },
};
