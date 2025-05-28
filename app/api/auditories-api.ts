import {
  type CreateAuditoryPayloadType,
  type UpdateAuditoryPayloadType,
  type UpdateAuditoryCategoryPayloadType,
  type CreateAuditoryCategoryPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type AuditoriesTypes, type AuditoryCategoriesTypes } from "../store/auditories/auditories-types";

export const auditoriesAPI = {
  /* categories */
  getAuditoryCategories() {
    return instanse.get<AuditoryCategoriesTypes[]>("/auditory-categories");
  },
  createAuditoryCategory(payload: CreateAuditoryCategoryPayloadType) {
    return instanse.post<AuditoryCategoriesTypes>("/auditory-categories", {
      payload,
    });
  },
  updateAuditoryCategory(payload: UpdateAuditoryCategoryPayloadType) {
    const { id, ...data } = payload;
    return instanse.patch<AuditoryCategoriesTypes>(`/auditory-categories/${id}`, data);
  },
  async deleteAuditoryCategory(id: number) {
    return instanse.delete<number>(`/auditory-categories/${id}`);
  },

  /* auditories */
  getAuditory(auditoryId: string) {
    return instanse.get<AuditoriesTypes>(`/auditories/${auditoryId}`);
  },
  createAuditory(payload: CreateAuditoryPayloadType) {
    return instanse.post<AuditoriesTypes>("/auditories", payload);
  },
  updateAuditory(payload: UpdateAuditoryPayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<AuditoriesTypes>(`/auditories/${id}`, rest);
  },
  deleteAuditory(id: number) {
    return instanse.delete<number>(`/auditories/${id}`);
  },
};
