import { instanse } from "./api";
import { PlanSubjectType } from "../store/plans/plans-types";
import { CreateSubjectPayloadType, UpdateSubjectHoursPayloadType, UpdateSubjectNamePayloadType } from "./apiTypes";

export const planSubjectsAPI = {
  getPlanSubjects(payload: { id: number; semesters: string }) {
    const { id, semesters } = payload;

    return instanse.get<PlanSubjectType[]>(`/plan-subjects/${id}`, { params: { semesters } });
  },

  createSubject(payload: CreateSubjectPayloadType) {
    return instanse.post<any>("/plan-subjects", payload);
  },
  updateSubjectName(payload: UpdateSubjectNamePayloadType) {
    return instanse.patch<{ id: number; name: string; cmk: number }[]>("/plan-subjects/name", payload);
  },
  updateSubjectHours(payload: UpdateSubjectHoursPayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<any>(`/plan-subjects/hours/${id}`, data);
  },
  deleteSubject(id: number) {
    return instanse.delete<number>(`/plan-subjects/${id}`);
  },
};
