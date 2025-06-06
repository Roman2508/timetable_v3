import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type CreateSubjectPayloadType,
  type UpdateSubjectNamePayloadType,
  type UpdateSubjectHoursPayloadType,
  type UpdatePlanPayloadType,
} from "../../api/api-types";
import { setLoadingStatus } from "./plans-slice";
import { LoadingStatusTypes } from "../app-types";
import { planSubjectsAPI, plansAPI } from "../../api/api";

/* category */

export const getPlansCategories = createAsyncThunk("plans/getPlansCategories", async (_, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = plansAPI.getPlansCategories();

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "Плани завантажено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const createPlanCategory = createAsyncThunk(
  "plans/createPlanCategory",
  async (payload: { name: string }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = plansAPI.createPlanCategory(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Категорію створено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const updatePlanCategory = createAsyncThunk(
  "plans/updatePlanCategory",
  async (payload: { name: string; id: number }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = plansAPI.updatePlanCategory(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Категорію оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const deletePlanCategory = createAsyncThunk("plans/deletePlanCategory", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = plansAPI.deletePlanCategory(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Категорію видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

/* plans */

export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (payload: { name: string; categoryId: number }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = plansAPI.createPlan(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "План створено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const updatePlan = createAsyncThunk("plans/updatePlan", async (payload: UpdatePlanPayloadType, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = plansAPI.updatePlan(payload);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "План оновлено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const deletePlan = createAsyncThunk("plans/deletePlan", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = plansAPI.deletePlan(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "План видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

/* plan-subjects */

export const getPlanSubjects = createAsyncThunk(
  "plans/getPlanSubjects",
  async (payload: { id: number; semesters: string }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = planSubjectsAPI.getPlanSubjects(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "План завантажено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const getPlanName = createAsyncThunk("plans/getPlanName", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = plansAPI.getPlanName(id);

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "План завантажено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const createPlanSubjects = createAsyncThunk(
  "plans/createPlanSubjects",
  async (payload: CreateSubjectPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = planSubjectsAPI.createSubject(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Дисципліну створено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const updatePlanSubjectsName = createAsyncThunk(
  "plans/updatePlanSubjectsName",
  async (payload: UpdateSubjectNamePayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = planSubjectsAPI.updateSubjectName(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Дисципліну оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const updatePlanSubjectsHours = createAsyncThunk(
  "plans/updatePlanSubjectsHours",
  async (payload: UpdateSubjectHoursPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = planSubjectsAPI.updateSubjectHours(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Дисципліну оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
        return (error as any)?.response?.data?.message || error.message;
      },
    });

    const { data } = await promise;
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
    return data;
  },
);

export const deletePlanSubjects = createAsyncThunk("plans/deletePlanSubjects", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = planSubjectsAPI.deleteSubject(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Дисципліну видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});
