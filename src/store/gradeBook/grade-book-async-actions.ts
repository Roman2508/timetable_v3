import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type GetGradesPayloadType,
  type UpdateGradePayloadType,
  type GetGradeBookPayloadType,
  type AddGradeBookSummaryPayloadType,
  type DeleteGradeBookSummaryPayloadType,
} from "../../api/api-types";
import { LoadingStatusTypes } from "../app-types";
import { setLoadingStatus } from "./grade-book-slice";
import { gradeBookAPI, teacherProfileAPI } from "../../api/api";

export const getGradeBook = createAsyncThunk(
  "group/getGradeBook",
  async (payload: GetGradeBookPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = gradeBookAPI.get(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Завантажено",
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

export const addSummary = createAsyncThunk(
  "group/addSummary",
  async (payload: AddGradeBookSummaryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = gradeBookAPI.addSummary(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано підсумок до журналу",
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

export const getLessonThemes = createAsyncThunk(
  "group/getLessonThemes",
  async (payload: { id: number; year: number }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.getInstructionalMaterials(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Завантажено",
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

export const deleteSummary = createAsyncThunk(
  "group/deleteSummary",
  async (payload: DeleteGradeBookSummaryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = gradeBookAPI.deleteSummary(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено підсумок з журналу",
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

/* grades */

export const getGrades = createAsyncThunk("group/getGrades", async (payload: GetGradesPayloadType, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = gradeBookAPI.getGrades(payload);

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "Завантажено рейтинг студента",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

export const updateGrade = createAsyncThunk("group/updateGrade", async (payload: UpdateGradePayloadType, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

  const promise = gradeBookAPI.updateGrade(payload);

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "Оновлено оцінку в журналі",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});
