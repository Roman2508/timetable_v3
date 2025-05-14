import { type PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

import {
  unpinTeacher,
  attachTeacher,
  getGroupOverlay,
  copyDaySchedule,
  copyWeekSchedule,
  deleteReplacement,
  getLessonStudents,
  getTeacherLessons,
  createReplacement,
  getTeacherOverlay,
  getAuditoryOverlay,
  getScheduleLessons,
  addStudentToLesson,
  createScheduleLesson,
  deleteScheduleLesson,
  updateScheduleLesson,
  findLessonsForSchedule,
  deleteStudentFromLesson,
  getGroupLoadByCurrentCourse,
  findGroupLoadLessonsByGroupIdAndSemester,
} from "./schedule-lessons-async-actions";
import {
  type ILastSelectedData,
  type ScheduleLessonType,
  type ScheduleLessonInitialStateType,
} from "./schedule-lessons-types";
import { type RootState } from "../store";
import { LoadingStatusTypes } from "../app-types";
import { type GroupLoadType } from "../groups/groups-types";
import { type StudentType } from "../students/students-types";
import { type TeachersType } from "../teachers/teachers-types";

// const getLocalStorageData = () => {
//   if (!window || typeof window === "undefined") return {};
//   const data = window.localStorage.getItem("persist:scheduleLessons");
//   if (data) return JSON.parse(data);
//   return {};
// };

const scheduleLessonsInitialState: ScheduleLessonInitialStateType = {
  groupLoad: null,
  teacherLessons: null,
  auditoryOverlay: null,
  groupOverlay: null,
  teacherOverlay: null,
  scheduleLessons: null,

  lessonStudents: null,

  lastOpenedSemester: 1,
  lastOpenedWeek: 1,
  lastSelectedItemId: 1,
  lastSelectedScheduleType: "group",
  lastSelectedStructuralUnitId: 1,
  // lastOpenedSemester: getLocalStorageData().lastOpenedSemester || 1,
  // lastOpenedWeek: getLocalStorageData().lastOpenedWeek || 1,
  // lastSelectedItemId: getLocalStorageData().lastSelectedItemId || 1,
  // lastSelectedScheduleType: getLocalStorageData().lastSelectedScheduleType || "group",
  // lastSelectedStructuralUnitId: getLocalStorageData().lastSelectedStructuralUnitId || 1,

  loadingStatus: LoadingStatusTypes.NEVER,
};

const scheduleLessonsSlice = createSlice({
  name: "scheduleLessons",
  initialState: scheduleLessonsInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    clearScheduleLessons(state) {
      state.scheduleLessons = null;
    },
    clearGroupLoad(state) {
      state.groupLoad = null;
    },
    // Delete one teacher lesson
    deleteTeacherOverlay(state, action: PayloadAction<number>) {
      if (!state.teacherLessons) return;
      const lessons = state.teacherLessons.filter((el) => el.id !== action.payload);
      state.teacherLessons = lessons;
    },
    // Delete all teacher lessons
    clearTeacherLessons(state) {
      state.teacherLessons = [];
    },
    clearLessonStudents(state) {
      state.lessonStudents = [];
    },
    clearGroupOverlay(state) {
      state.groupOverlay = [];
    },
    clearAuditoryOverlay(state) {
      state.auditoryOverlay = null;
    },
    clearTeacherOverlay(state) {
      state.teacherOverlay = null;
    },
    setLastSelectedData(state, action: PayloadAction<ILastSelectedData>) {
      if (action.payload.lastSelectedScheduleType) {
        state.lastSelectedScheduleType = action.payload.lastSelectedScheduleType;
      }
      if (action.payload.lastOpenedSemester) {
        state.lastOpenedSemester = action.payload.lastOpenedSemester;
      }
      if (action.payload.lastOpenedWeek) {
        state.lastOpenedWeek = action.payload.lastOpenedWeek;
      }
      if (action.payload.lastSelectedItemId) {
        state.lastSelectedItemId = action.payload.lastSelectedItemId;
      }
      if (action.payload.lastSelectedStructuralUnitId) {
        state.lastSelectedStructuralUnitId = action.payload.lastSelectedStructuralUnitId;
      }
    },
  },
  extraReducers: (builder) => {
    /* getScheduleLessons */
    builder.addCase(getScheduleLessons.fulfilled, (state, action: PayloadAction<ScheduleLessonType[]>) => {
      state.scheduleLessons = action.payload;
    });

    /* getGroupOverlay */
    builder.addCase(getGroupOverlay.fulfilled, (state, action: PayloadAction<ScheduleLessonType[]>) => {
      state.groupOverlay = action.payload;
    });

    /* getTeacherLessons */
    builder.addCase(getTeacherLessons.fulfilled, (state, action: PayloadAction<ScheduleLessonType[]>) => {
      state.teacherLessons = action.payload;
    });

    /* getAuditoryOverlay */
    builder.addCase(getAuditoryOverlay.fulfilled, (state, action: PayloadAction<{ id: number; name: string }[]>) => {
      state.auditoryOverlay = action.payload;
    });

    /* getTeacherOverlay */
    builder.addCase(getTeacherOverlay.fulfilled, (state, action: PayloadAction<TeachersType[]>) => {
      state.teacherOverlay = action.payload;
    });

    /* createScheduleLesson */
    builder.addCase(createScheduleLesson.fulfilled, (state, action: PayloadAction<ScheduleLessonType>) => {
      if (!state.scheduleLessons) return;
      state.scheduleLessons.push(action.payload);
    });

    /* copyWeekSchedule */
    builder.addCase(copyWeekSchedule.fulfilled, (state, action: PayloadAction<ScheduleLessonType[]>) => {
      if (!state.scheduleLessons) return;
      state.scheduleLessons = [...state.scheduleLessons, ...action.payload];
    });

    /* copyDaySchedule */
    builder.addCase(copyDaySchedule.fulfilled, (state, action: PayloadAction<ScheduleLessonType[]>) => {
      if (!state.scheduleLessons) return;
      state.scheduleLessons = [...state.scheduleLessons, ...action.payload];
    });

    /* createReplacement */
    builder.addCase(
      createReplacement.fulfilled,
      (state, action: PayloadAction<{ id: number; teacher: TeachersType }>) => {
        if (!state.scheduleLessons) return;
        const updatedLessons = state.scheduleLessons.map((el) => {
          if (el.id === action.payload.id) return { ...el, replacement: action.payload.teacher };
          return el;
        });
        // @ts-ignore // в action.payload є не всі параметри з TeachersType
        state.scheduleLessons = updatedLessons;
      },
    );

    /* deleteReplacement */
    builder.addCase(deleteReplacement.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.scheduleLessons) return;

      if (state.lastSelectedScheduleType !== "teacher") {
        const updatedLessons = state.scheduleLessons.map((el) => {
          if (el.id === action.payload) {
            return { ...el, replacement: null };
          }
          return el;
        });

        state.scheduleLessons = updatedLessons;
        return;
      }

      const scheduleLessons = state.scheduleLessons.filter((el) => el.id !== action.payload);
      state.scheduleLessons = scheduleLessons;
    });

    /* updateScheduleLesson */
    builder.addCase(updateScheduleLesson.fulfilled, (state, action: PayloadAction<ScheduleLessonType>) => {
      if (!state.scheduleLessons) return;

      const updatedLessons = state.scheduleLessons.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload };
        }
        return el;
      });
      state.scheduleLessons = updatedLessons;
    });

    /* deleteScheduleLesson */
    builder.addCase(deleteScheduleLesson.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.scheduleLessons) return;
      const lessons = state.scheduleLessons.find((el) => el.id === action.payload);

      console.log(JSON.parse(JSON.stringify(lessons)));
      console.log(JSON.parse(JSON.stringify(state.groupOverlay)));
      // ХЗ для чого це, перевірити:
      // Якщо це дисципліна потоку - видаляю всі інші дисципліни потоку які стоять в цей час
      if (lessons?.stream && state.teacherLessons) {
        const teacherLessons = state.teacherLessons.filter(
          (el) => el.lessonNumber !== lessons.lessonNumber && el.date !== lessons.date,
        );
        state.teacherLessons = teacherLessons;
        state.teacherOverlay = null;
      }

      // Якщо це дисципліна потоку - видаляю всі інші дисципліни потоку які стоять в цей час
      if (lessons?.stream && state.groupOverlay) {
        const groupOverlay = state.groupOverlay.filter((el) => {
          const isDateSame = el.date === lessons.date;
          const isLessonNumberSame = el.lessonNumber === lessons.lessonNumber;
          const isStreamSame = el.stream?.id === lessons.stream.id;
          return !(isDateSame && isLessonNumberSame && isStreamSame);
        });
        state.groupOverlay = groupOverlay;
      }

      const updatedLessons = state.scheduleLessons.filter((el) => el.id !== action.payload);
      state.scheduleLessons = updatedLessons;
    });

    /* findLessonsForSchedule */
    builder.addCase(findLessonsForSchedule.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      state.groupLoad = action.payload;
    });
    builder.addCase(findLessonsForSchedule.rejected, (state) => {
      state.groupLoad = [];
    });

    /* getGroupLoadByCurrentCourse */
    builder.addCase(getGroupLoadByCurrentCourse.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      state.groupLoad = action.payload;
    });

    /* findGroupLoadLessonsByGroupIdAndSemester */
    builder.addCase(
      findGroupLoadLessonsByGroupIdAndSemester.fulfilled,
      (state, action: PayloadAction<GroupLoadType[]>) => {
        state.groupLoad = action.payload;
      },
    );

    /* getLessonStudents */
    builder.addCase(getLessonStudents.fulfilled, (state, action: PayloadAction<StudentType[]>) => {
      state.lessonStudents = action.payload;
    });

    /* teachers attachment */
    /* attachTeacher */
    builder.addCase(
      attachTeacher.fulfilled,
      (state, action: PayloadAction<{ lessonId: number; teacher: TeachersType }>) => {
        if (!state.groupLoad) return;

        const lessons = state.groupLoad.map((el) => {
          if (el.id === action.payload.lessonId) {
            return { ...el, teacher: action.payload.teacher };
          }

          return el;
        });

        state.groupLoad = lessons;
      },
    );

    /* unpinTeacher */
    builder.addCase(unpinTeacher.fulfilled, (state, action: PayloadAction<{ lessonId: number }>) => {
      if (!state.groupLoad) return;

      const lessons = state.groupLoad.map((el) => {
        if (el.id === action.payload.lessonId) {
          return { ...el, teacher: null };
        }

        return el;
      });

      state.groupLoad = lessons;
    });

    /* students */

    /* addStudentToLesson */
    builder.addCase(addStudentToLesson.fulfilled, (state, action: PayloadAction<StudentType[]>) => {
      state.lessonStudents = action.payload;
    });

    /* deleteStudentFromLesson */
    builder.addCase(deleteStudentFromLesson.fulfilled, (state, action: PayloadAction<StudentType[]>) => {
      if (!state.lessonStudents) return;
      const students = state.lessonStudents.filter((el) => {
        return action.payload.some((s) => s.id === el.id);
      });

      state.lessonStudents = students;
    });
  },
});

export const scheduleLessonsSelector = (state: RootState) => state.scheduleLessons;

export const lastSelectedDataSelector = createSelector([scheduleLessonsSelector], (scheduleLessons) => ({
  lastOpenedSemester: scheduleLessons.lastOpenedSemester,
  lastOpenedWeek: scheduleLessons.lastOpenedWeek,
  lastSelectedItemId: scheduleLessons.lastSelectedItemId,
  lastSelectedScheduleType: scheduleLessons.lastSelectedScheduleType,
  lastSelectedStructuralUnitId: scheduleLessons.lastSelectedStructuralUnitId,
}));

export const lessonsForGradeBookSelector = createSelector(
  (state: RootState) => state.scheduleLessons.groupLoad,
  (groupLoad): { lessons: GroupLoadType[] } => {
    if (!groupLoad) return { lessons: [] };

    const lessons = groupLoad.filter(
      (el) => el.typeRu === "ЛК" || el.typeRu === "ПЗ" || el.typeRu === "ЛАБ" || el.typeRu === "СЕМ",
    );

    const lessonsCopy = JSON.parse(JSON.stringify(lessons));

    const typeOrder = ["ЛК", "ПЗ", "ЛАБ", "СЕМ"];

    lessonsCopy.sort((a: GroupLoadType, b: GroupLoadType) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return typeOrder.indexOf(a.typeRu) - typeOrder.indexOf(b.typeRu);
    });

    return { lessons: lessonsCopy };
  },
);

export const {
  clearGroupLoad,
  setLoadingStatus,
  clearGroupOverlay,
  clearTeacherOverlay,
  setLastSelectedData,
  clearTeacherLessons,
  clearLessonStudents,
  deleteTeacherOverlay,
  clearAuditoryOverlay,
  clearScheduleLessons,
} = scheduleLessonsSlice.actions;

export default scheduleLessonsSlice.reducer;
