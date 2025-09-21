import { instanse } from "./api";
import { type CreatePlanPayloadType, type UpdatePlanPayloadType } from "./api-types";
import { type PlansCategoriesType, type PlansType, type PlanType } from "../store/plans/plans-types";

export const plansAPI = {
  /* categories */
  getPlansCategories() {
    return instanse.get<PlansCategoriesType[]>("/plan-categories");
  },
  createPlanCategory(payload: { name: string }) {
    return instanse.post<PlansCategoriesType>("/plan-categories", payload);
  },
  updatePlanCategory(payload: { name: string; id: number }) {
    return instanse.patch<PlansCategoriesType>(`/plan-categories/${payload.id}`, {
      name: payload.name,
    });
  },
  deletePlanCategory(id: number) {
    return instanse.delete<number>(`/plan-categories/${id}`);
  },

  /* plans */
  getPlanName(id: number) {
    return instanse.get<PlanType>(`/plans/${id}`);
  },
  createPlan(payload: CreatePlanPayloadType) {
    return instanse.post<PlansType>("/plans", payload);
  },
  updatePlan(payload: UpdatePlanPayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<PlansType>(`/plans/${id}`, rest);
  },
  deletePlan(id: number) {
    return instanse.delete<number>(`/plans/${id}`);
  },
};
