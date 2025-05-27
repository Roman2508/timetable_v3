import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type CreateAuditoryPayloadType,
  type UpdateAuditoryPayloadType,
  type UpdateAuditoryCategoryPayloadType,
  type CreateAuditoryCategoryPayloadType,
} from "../../api/api-types";
import { auditoriesAPI } from "../../api/api";
import { LoadingStatusTypes } from "../app-types";
import { setLoadingStatus } from "./auditories-slise";

/* categories */
export const getAuditoryCategories = createAsyncThunk(
  "auditory-categories/getAuditoryCategories",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.getAuditoryCategories();

    toast.promise(promise, {
      // loading: 'Завантаження...',
      // success: 'Аудиторії завантажено',
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

export const createAuditoryCategory = createAsyncThunk(
  "auditory-categories/createAuditoryCategory",
  async (name: CreateAuditoryCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.createAuditoryCategory(name);

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

export const updateAuditoryCategory = createAsyncThunk(
  "auditory-categories/updateAuditoryCategory",
  async (payload: UpdateAuditoryCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.updateAuditoryCategory(payload);

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

export const deleteAuditoryCategory = createAsyncThunk(
  "auditory-categories/deleteAuditoryCategory",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.deleteAuditoryCategory(id);

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
  },
);

/* auditories */

export const createAuditory = createAsyncThunk(
  "auditory-categories/createAuditory",
  async (payload: CreateAuditoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.createAuditory(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Аудиторію створено",
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

export const updateAuditory = createAsyncThunk(
  "auditory-categories/updateAuditory",
  async (payload: UpdateAuditoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = auditoriesAPI.updateAuditory(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Аудиторію оновлено",
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

export const deleteAuditory = createAsyncThunk("auditory-categories/deleteAuditory", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = auditoriesAPI.deleteAuditory(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Аудиторію видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});
