import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type CreateTeacherPayloadType,
  type UpdateTeacherPayloadType,
  type CreateTeacherCategoryPayloadType,
  type UpdateTeacherCategoryPayloadType,
} from "../../api/apiTypes";
import { teachersAPI } from "../../api/api";
import { LoadingStatusTypes } from "../app-types";
import { setLoadingStatus } from "./teachers-slice";

/* categories */

export const getTeachersCategories = createAsyncThunk(
  "teachers-categories/getTeachersCategories",
  async (isHide: boolean, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.getTeachersCategories(isHide);

    toast.promise(promise, {
      // loading: 'Завантаження...',
      // success: 'Завантажено',
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

export const createTeacherCategory = createAsyncThunk(
  "teachers-categories/createTeacherCategory",
  async (payload: CreateTeacherCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.createTeacherCategory(payload);

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

export const updateTeacherCategory = createAsyncThunk(
  "teachers-categories/updateTeacherCategory",
  async (payload: UpdateTeacherCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.updateTeacherCategory(payload);

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

export const handleTeacherVisible = createAsyncThunk(
  "teachers-categories/handleTeacherVisible",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.handleTeacherVisible(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Викладача оновлено",
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

export const deleteTeacherCategory = createAsyncThunk(
  "teachers-categories/deleteTeacherCategory",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.deleteTeacherCategory(id);

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

/* teachers */

export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (payload: CreateTeacherPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.createTeacher(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Викладача створено",
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

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async (payload: UpdateTeacherPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teachersAPI.updateTeacher(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Викладача оновлено",
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

export const deleteTeacher = createAsyncThunk("teachers/deleteTeacher", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = teachersAPI.deleteTeacher(id);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Викладача видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});
