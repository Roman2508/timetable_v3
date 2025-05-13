import { instanse } from "./api";
import { CreatePlanPayloadType } from "./apiTypes";
import { PlansCategoriesType, PlansType, PlanType } from "../store/plans/plans-types";

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
  updatePlan(payload: { name: string; id: number }) {
    return instanse.patch<PlansType>(`/plans/${payload.id}`, {
      name: payload.name,
    });
  },
  deletePlan(id: number) {
    return instanse.delete<number>(`/plans/${id}`);
  },
};
