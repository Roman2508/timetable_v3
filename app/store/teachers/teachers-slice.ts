import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  createTeacher,
  deleteTeacher,
  updateTeacher,
  handleTeacherVisible,
  createTeacherCategory,
  deleteTeacherCategory,
  getTeachersCategories,
  updateTeacherCategory,
} from "./teachers-async-actions";
import type { RootState } from "../app-types";
import { LoadingStatusTypes } from "../app-types";
import { type TeachersCategoryType, type TeachersInitialState, type TeachersType } from "./teachers-types";

const teachersInitialState: TeachersInitialState = {
  teachersCategories: null,
  loadingStatus: LoadingStatusTypes.NEVER,
};

const teachersSlice = createSlice({
  name: "teachers",
  initialState: teachersInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    clearTeachers(state) {
      state.teachersCategories = null;
      state.loadingStatus = LoadingStatusTypes.LOADING;
    },
    setTeacherCategories(state, action: PayloadAction<TeachersCategoryType[]>) {
      state.teachersCategories = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* --- categories --- */
    builder.addCase(getTeachersCategories.fulfilled, (state, action: PayloadAction<TeachersCategoryType[]>) => {
      state.teachersCategories = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* createTeacherCategory */
    builder.addCase(createTeacherCategory.fulfilled, (state, action: PayloadAction<TeachersCategoryType>) => {
      if (!state.teachersCategories) return;

      state.teachersCategories = [...state.teachersCategories, action.payload];
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* updateTeacherCategory */
    builder.addCase(updateTeacherCategory.fulfilled, (state, action: PayloadAction<TeachersCategoryType>) => {
      if (!state.teachersCategories) return;

      const newCategories = state.teachersCategories.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, name: action.payload.name, shortName: action.payload.shortName };
        }

        return el;
      });

      state.teachersCategories = newCategories;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* deleteTeacherCategory */
    builder.addCase(deleteTeacherCategory.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.teachersCategories) return;

      const newCategories = state.teachersCategories.filter((el) => el.id !== action.payload);

      state.teachersCategories = newCategories;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* --- teachers --- */

    /* createTeacher */
    builder.addCase(createTeacher.fulfilled, (state, action: PayloadAction<TeachersType>) => {
      if (!state.teachersCategories) return;

      const newTeacherCategories = state.teachersCategories.map((el) => {
        if (el.id === action.payload.category.id) {
          return { ...el, teachers: [...el.teachers, action.payload] };
        }

        return el;
      });

      state.teachersCategories = newTeacherCategories;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* updateTeacher */
    builder.addCase(updateTeacher.fulfilled, (state, action: PayloadAction<TeachersType>) => {
      if (!state.teachersCategories) return;

      let isChangeCategory = false;

      const newTeachersCategories = state.teachersCategories.map((el) => {
        const newTeachers = el.teachers.map((teacher) => {
          if (teacher.id === action.payload.id) {
            if (teacher.category.id === action.payload.category.id) {
              return action.payload;
            }

            isChangeCategory = true;
            return null;
          }

          return { ...teacher };
        });

        const filtredTeachers = newTeachers.filter((el) => el !== null);
        return { ...el, teachers: filtredTeachers };
      });

      // Якщо категорія змінилась
      if (isChangeCategory) {
        const newCategories = newTeachersCategories.map((el) => {
          if (el.id === action.payload.category.id) {
            const teachers = [...el.teachers, action.payload];
            return { ...el, teachers };
          }
          return el;
        });
        // @ts-ignore
        state.teachersCategories = newCategories;
      } else {
        // @ts-ignore
        state.teachersCategories = newTeachersCategories;
      }
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* handleTeacherVisible */
    builder.addCase(handleTeacherVisible.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      if (!state.teachersCategories) return;

      const updatedCategories = state.teachersCategories.map((el) => {
        const newGroups = el.teachers.filter((teacher) => teacher.id !== action.payload.id);
        return { ...el, teachers: newGroups };
      });

      state.teachersCategories = updatedCategories;
    });

    /* deleteTeacher */
    builder.addCase(deleteTeacher.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.teachersCategories) return;

      const updatedCategories = state.teachersCategories.map((el) => {
        const newTeachers = el.teachers.filter((teacher) => teacher.id !== action.payload);

        return { ...el, teachers: newTeachers };
      });

      state.teachersCategories = updatedCategories;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });
  },
});

export const { setLoadingStatus, clearTeachers, setTeacherCategories } = teachersSlice.actions;

export default teachersSlice.reducer;

export const teachersSelector = (state: RootState) => state.teachers;
