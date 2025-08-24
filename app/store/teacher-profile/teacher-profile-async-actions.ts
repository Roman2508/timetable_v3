import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type GetTeacherReportType,
  type CreateTeacherReportType,
  type UpdateTeacherReportType,
  type TeacherReportUploadFileType,
  type TeacherReportDeleteFileType,
  type UpdateIndividualTeacherWorkType,
  type CreateIndividualTeacherWorkType,
  type UpdateInstructionalMaterialsPayloadType,
  type CreateInstructionalMaterialsPayloadType,
  type ImportInstructionalMaterialsPayloadType,
} from "../../api/api-types";
import { LoadingStatusTypes } from "../app-types";
import { setLoadingStatus } from "./teacher-profile-slice";
import { teacherProfileAPI } from "../../api/teacher-profile-api";
import { groupLoadLessonsAPI } from "../../api/group-load-lessons-api";

/* instructional-materials */
export const getInstructionalMaterials = createAsyncThunk(
  "teacher-profile/getInstructionalMaterials",
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

export const createInstructionalMaterials = createAsyncThunk(
  "teacher-profile/createInstructionalMaterials",
  async (payload: CreateInstructionalMaterialsPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.createInstructionalMaterial(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано нову тему",
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

export const updateInstructionalMaterials = createAsyncThunk(
  "teacher-profile/updateInstructionalMaterials",
  async (payload: UpdateInstructionalMaterialsPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.updateInstructionalMaterial(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано тему уроку",
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

export const importInstructionalMaterials = createAsyncThunk(
  "teacher-profile/importInstructionalMaterials",
  async (payload: ImportInstructionalMaterialsPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.importInstructionalMaterial(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Імпортовано теми",
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

export const deleteInstructionalMaterials = createAsyncThunk(
  "teacher-profile/deleteInstructionalMaterials",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.deleteInstructionalMaterial(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено тему уроку",
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

export const findAllTeacherLessonsById = createAsyncThunk(
  "teacher-profile/findAllTeacherLessonsById",
  async (teacherId: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = groupLoadLessonsAPI.findAllTeacherLessonsById(teacherId);

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

// Для instructional-materials
export const findAllTeacherLessonsByIdAndYear = createAsyncThunk(
  "teacher-profile/findAllTeacherLessonsByIdAndYear",
  async (payload: { teacherId: number; year: number }, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = groupLoadLessonsAPI.findAllTeacherLessonsByIdAndYear(payload);

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

/* teacher load */
export const getTeacherLoadById = createAsyncThunk(
  "teacher-profile/getTeacherLoadById",
  async (teacherId: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = groupLoadLessonsAPI.findAllTeacherLessonsById(teacherId);

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

/* individual-teacher-work */
export const getIndividualTeacherWork = createAsyncThunk(
  "teacher-profile/getIndividualTeacherWork",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.getIndividualTeacherWork();

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

export const createIndividualTeacherWork = createAsyncThunk(
  "teacher-profile/createIndividualTeacherWork",
  async (payload: CreateIndividualTeacherWorkType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.createIndividualTeacherWork(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано нову діяльність",
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

export const updateIndividualTeacherWork = createAsyncThunk(
  "teacher-profile/updateIndividualTeacherWork",
  async (payload: UpdateIndividualTeacherWorkType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.updateIndividualTeacherWork(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Оновлено діяльність індивідуального плану",
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

export const deleteIndividualTeacherWork = createAsyncThunk(
  "teacher-profile/deleteIndividualTeacherWork",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.deleteIndividualTeacherWork(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено діяльність з індивідуального плану",
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

/* teacher-report */
export const getTeacherReport = createAsyncThunk(
  "teacher-profile/getTeacherReport",
  async (payload: GetTeacherReportType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.getTeacherReport(payload);

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

export const createTeacherReport = createAsyncThunk(
  "teacher-profile/createTeacherReport",
  async (payload: CreateTeacherReportType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.createTeacherReport(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано діяльність до звіту",
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

export const updateTeacherReport = createAsyncThunk(
  "teacher-profile/updateTeacherReport",
  async (payload: UpdateTeacherReportType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.updateTeacherReport(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Оновлено",
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

export const uploadTeacherReportFile = createAsyncThunk(
  "teacher-profile/uploadTeacherReportFile",
  async (payload: TeacherReportUploadFileType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.createFile(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано файл до звіту",
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

export const deleteTeacherReportFile = createAsyncThunk(
  "teacher-profile/deleteTeacherReportFile",
  async (payload: TeacherReportDeleteFileType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.deleteFile(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Файл видалено",
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

export const deleteTeacherReport = createAsyncThunk(
  "teacher-profile/deleteTeacherReport",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = teacherProfileAPI.deleteTeacherReport(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено діяльність зі звіту",
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
