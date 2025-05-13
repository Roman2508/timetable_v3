import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type AddStudentToLessonType,
  type AttachTeacherPayloadType,
  type GetGroupOverlayPayloadType,
  type CopyDaySchedulePayloadType,
  type DeleteStudentFromLessonType,
  type CopyWeekSchedulePayloadType,
  type CreateReplacementPayloadType,
  type GetTeachersOverlayPayloadType,
  type GetAuditoryOverlayPayloadType,
  type GetScheduleLessonsPayloadType,
  type UpdateScheduleLessonsPayloadType,
  type CreateScheduleLessonsPayloadType,
  type AddStudentsToAllGroupLessonsType,
  type FindLessonsForSchedulePayloadType,
  type DeleteStudentsFromAllGroupLessonsType,
  type FindGroupLoadLessonsByGroupIdAndSemesterPayloadType,
} from "../../api/apiTypes";
import { LoadingStatusTypes } from "../app-types";
import { setLoadingStatus } from "./schedule-lessons-slice";
import { type GroupLoadType } from "../groups/groups-types";
import { type TeachersType } from "../teachers/teachers-types";
import { type ScheduleLessonType } from "./schedule-lessons-types";
import { groupLoadLessonsAPI, scheduleLessonsAPI } from "../../api/api";

/* getScheduleLessons === Розклад (вже виставлений) */
export const getScheduleLessons = createAsyncThunk(
  "schedule-lessons/getScheduleLessons",
  async (payload: GetScheduleLessonsPayloadType, thunkAPI): Promise<ScheduleLessonType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.getLessons(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Розклад завантажено",
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

/*  */

export const getGroupLoadByCurrentCourse = createAsyncThunk(
  "schedule-lessons/getGroupLoadByCurrentCourse",
  async (id: number, thunkAPI): Promise<GroupLoadType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.getGroupLoadByCurrentCourse(id);

    toast.promise(promise, {
      // loading: "Завантаження...",
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

/*  */

export const getGroupOverlay = createAsyncThunk(
  "schedule-lessons/getGroupOverlay",
  async (payload: GetGroupOverlayPayloadType, thunkAPI): Promise<ScheduleLessonType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.getGroupOverlay(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
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

/*  */

// getScheduleLessons
export const getTeacherLessons = createAsyncThunk(
  "schedule-lessons/getTeacherLessons",
  async (payload: GetScheduleLessonsPayloadType, thunkAPI): Promise<ScheduleLessonType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.getLessons(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Розклад завантажено",
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

/*  */

export const getTeacherOverlay = createAsyncThunk(
  "schedule-lessons/getTeacherOverlay",
  async (payload: GetTeachersOverlayPayloadType, thunkAPI): Promise<TeachersType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.getTeacherOverlay(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
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

/*  */

export const getAuditoryOverlay = createAsyncThunk(
  "schedule-lessons/getAuditoryOverlay",
  async (payload: GetAuditoryOverlayPayloadType, thunkAPI): Promise<{ id: number; name: string }[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.getAuditoryOverlay(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
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

/*  */

export const createScheduleLesson = createAsyncThunk(
  "schedule-lessons/createScheduleLesson",
  async (payload: CreateScheduleLessonsPayloadType, thunkAPI): Promise<ScheduleLessonType> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.create(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано елемент розкладу",
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

/*  */

/* copy schedule */
export const copyWeekSchedule = createAsyncThunk(
  "schedule-lessons/copyWeekSchedule",
  async (payload: CopyWeekSchedulePayloadType, thunkAPI): Promise<ScheduleLessonType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.copyWeekSchedule(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Розклад скопійовано",
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

/*  */

export const copyDaySchedule = createAsyncThunk(
  "schedule-lessons/copyDaySchedule",
  async (payload: CopyDaySchedulePayloadType, thunkAPI): Promise<ScheduleLessonType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.copyDaySchedule(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Розклад скопійовано",
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

/*  */

/* replacement */
export const createReplacement = createAsyncThunk(
  "schedule-lessons/createReplacement",
  async (payload: CreateReplacementPayloadType, thunkAPI): Promise<{ id: number; teacher: TeachersType }> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = scheduleLessonsAPI.createReplacement(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Зроблено заміну",
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

/*  */

export const deleteReplacement = createAsyncThunk(
  "schedule-lessons/deleteReplacement",
  async (id: number, thunkAPI): Promise<number> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.deleteReplacement(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено заміну",
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

/*  */

export const updateScheduleLesson = createAsyncThunk(
  "schedule-lessons/updateScheduleLesson",
  async (payload: UpdateScheduleLessonsPayloadType, thunkAPI): Promise<ScheduleLessonType> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.update(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Оновлено елемент розкладу",
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

/*  */

export const deleteScheduleLesson = createAsyncThunk(
  "schedule-lessons/deleteScheduleLesson",
  async (id: number, thunkAPI): Promise<number> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = scheduleLessonsAPI.delete(id);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено елемент розкладу",
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

/*  */

/* findLessonsForSchedule === Навантаження групи / викладача / аудиторії: <LessonsTable /> in timetable page */
export const findLessonsForSchedule = createAsyncThunk(
  "group/findLessonsForSchedule",
  async (payload: FindLessonsForSchedulePayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = groupLoadLessonsAPI.findLessonsForSchedule(payload);

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Розклад завантажено",
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

/*  */

/* getLessonStudents */
export const getLessonStudents = createAsyncThunk("group/getLessonStudents", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
  const promise = groupLoadLessonsAPI.getLessonStudents(id);

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
});

/*  */

/* get all semester lessons for students divide */
export const findGroupLoadLessonsByGroupIdAndSemester = createAsyncThunk(
  "group/findGroupLoadLessonsByGroupIdAndSemester",
  async (payload: FindGroupLoadLessonsByGroupIdAndSemesterPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.findGroupLoadLessonsByGroupIdAndSemester(payload);

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

/*  */

/* teachers attachment */

/* attachTeacher */
export const attachTeacher = createAsyncThunk(
  "group/attachTeacher",
  async (payload: AttachTeacherPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.attachTeacher(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Викладача прикріплено до дисципліни",
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

/*  */

/* unpinTeacher */
export const unpinTeacher = createAsyncThunk("group/unpinTeacher", async (lessonId: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
  const promise = groupLoadLessonsAPI.unpinTeacher(lessonId);

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Викладача відкріплено від дисципліни",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});

/*  */

/* add/delete students to/from lesson */
export const addStudentToLesson = createAsyncThunk(
  "group/addStudentToLesson",
  async (payload: AddStudentToLessonType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));

    const promise = groupLoadLessonsAPI.addStudentsToLesson(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Студента зараховано на дисципліну",
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

/*  */

export const deleteStudentFromLesson = createAsyncThunk(
  "group/deleteStudentFromLesson",
  async (payload: DeleteStudentFromLessonType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.deleteStudentsFromLesson(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Студента відраховано з дисципліни",
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

/*  */

export const addStudentsToAllGroupLessons = createAsyncThunk(
  "group/addStudentsToAllGroupLessons",
  async (payload: AddStudentsToAllGroupLessonsType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.addStudentsToAllGroupLessons(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Студента зараховано на дисципліни",
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

/*  */

export const deleteStudentsFromAllGroupLessons = createAsyncThunk(
  "group/deleteStudentsFromAllGroupLessons",
  async (payload: DeleteStudentsFromAllGroupLessonsType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
    const promise = groupLoadLessonsAPI.deleteStudentsFromAllGroupLessons(payload);

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Студента відраховано з дисциплін",
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

/*  */
