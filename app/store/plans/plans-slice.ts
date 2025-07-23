import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  type PlanType,
  type PlansType,
  type PlanSubjectType,
  type PlansInitialState,
  type PlansCategoriesType,
} from "./plans-types";
import {
  createPlan,
  updatePlan,
  deletePlan,
  getPlanName,
  getPlanSubjects,
  createPlanCategory,
  deletePlanCategory,
  getPlansCategories,
  updatePlanCategory,
  createPlanSubjects,
  deletePlanSubjects,
  updatePlanSubjectsName,
  updatePlanSubjectsHours,
} from "./plans-async-actions";
import type { RootState } from "../app-types";
import { LoadingStatusTypes } from "../app-types";

const plansInitialState: PlansInitialState = {
  plansCategories: null,
  plan: null,
  planSubjects: null,
  loadingStatus: LoadingStatusTypes.NEVER,
};

const plansSlice = createSlice({
  name: "plans",
  initialState: plansInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    clearPlan(state) {
      state.plan = null;
      state.planSubjects = null;
    },
    setPlanCategories(state, action: PayloadAction<PlansCategoriesType[]>) {
      state.plansCategories = action.payload;
    },
    setPlan(state, action: PayloadAction<PlanType>) {
      state.plan = action.payload;
    },
    setPlanSubjects(state, action: PayloadAction<PlanSubjectType[]>) {
      state.planSubjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* --- categories --- */

    /* getPlansCategories */
    builder.addCase(getPlansCategories.fulfilled, (state, action: PayloadAction<PlansCategoriesType[]>) => {
      state.plansCategories = action.payload;
    });

    /* createPlanCategory */
    builder.addCase(createPlanCategory.fulfilled, (state, action: PayloadAction<PlansCategoriesType>) => {
      if (!state.plansCategories) return;
      state.plansCategories = [...state.plansCategories, action.payload];
    });

    /* updatePlanCategory */
    builder.addCase(updatePlanCategory.fulfilled, (state, action: PayloadAction<PlansCategoriesType>) => {
      if (!state.plansCategories) return;

      const newCategories = state.plansCategories.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload };
        }

        return el;
      });

      state.plansCategories = newCategories;
    });

    /* deletePlanCategory */
    builder.addCase(deletePlanCategory.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.plansCategories) return;

      const newCategories = state.plansCategories.filter((el) => el.id !== action.payload);

      state.plansCategories = newCategories;
    });

    /* --- plans --- */

    /* createPlan */
    builder.addCase(createPlan.fulfilled, (state, action: PayloadAction<PlansType>) => {
      if (!state.plansCategories) return;

      const newPlansCategories = state.plansCategories.map((el) => {
        if (el.id === action.payload.category.id) {
          return { ...el, plans: [...el.plans, action.payload] };
        }

        return el;
      });

      state.plansCategories = newPlansCategories;
    });

    /* updatePlan */
    builder.addCase(updatePlan.fulfilled, (state, action: PayloadAction<PlansType>) => {
      if (!state.plansCategories) return;

      const newPlansCategories = state.plansCategories.map((el) => {
        if (el.id === action.payload.category.id) {
          const newPlans = el.plans.map((plan) => {
            if (plan.id === action.payload.id) {
              return action.payload;
            }

            return plan;
          });

          return { ...el, plans: newPlans };
        }

        return el;
      });

      state.plan = action.payload;
      state.plansCategories = newPlansCategories;
    });

    /* updatePlanSubjectsName */
    builder.addCase(
      updatePlanSubjectsName.fulfilled,
      (state, action: PayloadAction<{ id: number; name: string; cmk: number }[]>) => {
        if (!state.planSubjects) return;

        const subjects = state.planSubjects.map((el) => {
          if (el.id === action.payload[0].id) {
            return { ...el, name: action.payload[0].name, cmk: { id: action.payload[0].cmk } };
          }

          return el;
        });
        // @ts-ignore
        state.planSubjects = subjects;
      },
    );

    /* createPlanSubjects */
    builder.addCase(createPlanSubjects.fulfilled, (state, action: PayloadAction<PlanSubjectType>) => {
      if (!state.planSubjects) return;

      state.planSubjects.push(action.payload);
    });

    /* updatePlanSubjectsHours */
    builder.addCase(updatePlanSubjectsHours.fulfilled, (state, action: PayloadAction<PlanSubjectType>) => {
      if (!state.planSubjects) return;

      const isExist = state.planSubjects.some((el) => el.id === action.payload.id);

      if (isExist) {
        const subjects = state.planSubjects.map((el) => {
          if (el.id === action.payload.id) {
            return action.payload;
          }

          return el;
        });
        state.planSubjects = subjects;
      } else {
        state.planSubjects.push(action.payload);
      }
    });

    /* deletePlanSubjects */
    builder.addCase(deletePlanSubjects.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.planSubjects) return;

      const subjects = state.planSubjects.filter((subject) => subject.id !== action.payload);
      state.planSubjects = subjects;
    });

    /* deletePlan */
    builder.addCase(deletePlan.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.plansCategories) return;

      const updatedCategories = state.plansCategories.map((el) => {
        const newPlans = el.plans.filter((plan) => plan.id !== action.payload);

        return { ...el, plans: newPlans };
      });

      state.plansCategories = updatedCategories;
    });

    /* getPlanName */
    builder.addCase(getPlanName.fulfilled, (state, action: PayloadAction<PlanType>) => {
      state.plan = action.payload;
    });

    /* getPlanSubjects */
    builder.addCase(getPlanSubjects.fulfilled, (state, action: PayloadAction<PlanSubjectType[]>) => {
      state.planSubjects = action.payload;
    });
  },
});

export const { setLoadingStatus, clearPlan, setPlanCategories, setPlan, setPlanSubjects } = plansSlice.actions;

export default plansSlice.reducer;

export const plansSelector = (state: RootState) => state.plans;
