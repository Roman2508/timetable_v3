import {
  type GetGradesPayloadType,
  type GetGradesResponceType,
  type AddSummaryResponceType,
  type UpdateGradePayloadType,
  type GetGradeBookPayloadType,
  type UpdateGradesResponceType,
  type AddGradeBookSummaryPayloadType,
  type DeleteGradeBookSummaryPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type GradeBookType } from "../store/gradeBook/grade-book-types";

export const gradeBookAPI = {
  get(payload: GetGradeBookPayloadType) {
    const { group, lesson, semester, type } = payload;
    return instanse.get<GradeBookType>(`/grade-book/${semester}/${group}/${lesson}/${type}`);
  },

  addSummary(payload: AddGradeBookSummaryPayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<AddSummaryResponceType>(`/grade-book/summary/add/${id}`, data);
  },

  deleteSummary(payload: DeleteGradeBookSummaryPayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<AddSummaryResponceType>(`/grade-book/summary/delete/${id}`, data);
  },

  getGrades(payload: GetGradesPayloadType) {
    const { studentId, semester } = payload;
    return instanse.get<GetGradesResponceType>(`/grades/${semester}/${studentId}`);
  },

  // createGrades(payload: CreateGradesPayloadType) {
  //   return instanse.post<GetGradesResponceType[]>(`/grades`, payload)
  // },

  updateGrade(payload: UpdateGradePayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<UpdateGradesResponceType>(`/grades/${id}`, data);
  },

  // deleteGrades(payload: DeleteGradesPayloadType) {
  //   return instanse.patch<GetGradesResponceType[]>(`/grades/delete`, payload)
  // },
};
