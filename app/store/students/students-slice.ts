import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { type RootState } from "../store";
import { LoadingStatusTypes } from "../app-types";
import { type StudentType, type StudentsInitialState } from "./students-types";
import { createStudent, deleteStudent, updateStudent, getStudentsByGroupId } from "./students-async-actions";

const plansInitialState: StudentsInitialState = {
  students: null,
  loadingStatus: LoadingStatusTypes.NEVER,
};

const plansSlice = createSlice({
  name: "students",
  initialState: plansInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    clearStudents(state) {
      state.students = [];
    },
  },
  extraReducers: (builder) => {
    /* getStudentsByGroupId */
    builder.addCase(getStudentsByGroupId.fulfilled, (state, action: PayloadAction<StudentType[]>) => {
      state.students = action.payload;
    });

    /* createStudent */
    builder.addCase(createStudent.fulfilled, (state, action: PayloadAction<StudentType>) => {
      if (!state.students) return;
      state.students = [...state.students, action.payload];
    });

    /* updateStudent */
    builder.addCase(updateStudent.fulfilled, (state, action: PayloadAction<StudentType>) => {
      if (!state.students) return;
      const students = state.students.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload };
        }

        return el;
      });
      state.students = students;
    });

    /* deleteStudent */
    builder.addCase(deleteStudent.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.students) return;
      const students = state.students.filter((el) => el.id !== action.payload);
      state.students = students;
    });
  },
});

export const { setLoadingStatus, clearStudents } = plansSlice.actions;

export default plansSlice.reducer;

export const studentsSelector = (state: RootState) => state.students;
