import { instanse } from "./api";
import { StudentType } from "../store/students/students-types";
import { CreateStudentsPayloadType, UpdateStudentsPayloadType } from "./apiTypes";

export const studentsAPI = {
  getByGroupId(id: number) {
    return instanse.get<StudentType[]>(`/students/${id}`);
  },
  create(payload: CreateStudentsPayloadType) {
    return instanse.post<StudentType>("/students", payload);
  },
  update(payload: UpdateStudentsPayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<StudentType>(`/students/${id}`, rest);
  },
  delete(id: number) {
    return instanse.delete<number>(`/students/${id}`);
  },
};
