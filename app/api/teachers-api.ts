import {
  type UpdateTeacherPayloadType,
  type CreateTeacherPayloadType,
  type CreateTeacherCategoryPayloadType,
  type UpdateTeacherCategoryPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type TeachersCategoryType } from "../store/teachers/teachers-types";

export const teachersAPI = {
  /* categories */
  getTeachersCategories() {
    return instanse.get<TeachersCategoryType[]>(`/teacher-categories`);
  },
  createTeacherCategory(payload: CreateTeacherCategoryPayloadType) {
    return instanse.post("/teacher-categories/", { name: payload.name });
  },
  updateTeacherCategory(payload: UpdateTeacherCategoryPayloadType) {
    const { id, ...rest } = payload;

    return instanse.patch<TeachersCategoryType>(`/teacher-categories/${id}`, rest);
  },
  deleteTeacherCategory(id: number) {
    return instanse.delete<number>(`/teacher-categories/${id}`);
  },

  /* teachers */
  getTeacher(id: string) {
    return instanse.get(`/teachers/${id}`);
  },
  createTeacher(payload: CreateTeacherPayloadType) {
    return instanse.post("/teachers", payload);
  },
  updateTeacher(payload: UpdateTeacherPayloadType) {
    const { id, ...rest } = payload;

    return instanse.patch(`/teachers/${id}`, rest);
  },
  handleTeacherVisible(id: number) {
    return instanse.patch<{ id: number }>(`/teachers/handle-visible/${id}`);
  },
  deleteTeacher(id: number) {
    return instanse.delete(`/teachers/${id}`);
  },
};
