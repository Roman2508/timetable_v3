import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  getTeacherReport,
  getTeacherLoadById,
  createTeacherReport,
  updateTeacherReport,
  deleteTeacherReport,
  uploadTeacherReportFile,
  deleteTeacherReportFile,
  getIndividualTeacherWork,
  getInstructionalMaterials,
  findAllTeacherLessonsById,
  createIndividualTeacherWork,
  updateIndividualTeacherWork,
  deleteIndividualTeacherWork,
  createInstructionalMaterials,
  deleteInstructionalMaterials,
  updateInstructionalMaterials,
  importInstructionalMaterials,
  findAllTeacherLessonsByIdAndYear,
} from "./teacher-profile-async-actions";
import {
  type TeacherReportType,
  type IndividualWorkPlanType,
  type InstructionalMaterialsType,
  type TeacherProfileInitialInitialState,
} from "./teacher-profile-types";
import { type RootState } from "../store";
import { LoadingStatusTypes } from "../app-types";
import { type GroupLoadType } from "../groups/groups-types";
import { type TeacherReportUploadFileResponceType } from "../../api/apiTypes";

const teacherProfileInitialState: TeacherProfileInitialInitialState = {
  report: null,
  workload: null,
  generalInfo: null,
  filterLesson: null,
  individualWorkPlan: null,
  instructionalMaterials: null,
  loadingStatus: LoadingStatusTypes.NEVER,
};

const teacherProfileSlice = createSlice({
  name: "teacher-profile",
  initialState: teacherProfileInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },
    clearInstructionalMaterials(state) {
      state.instructionalMaterials = null;
    },
    clearTeacherReports(state) {
      state.report = null;
    },
    clearIndividualTeacherWork(state) {
      state.individualWorkPlan = null;
    },
  },
  extraReducers: (builder) => {
    /* --- instructional-materials --- */

    /* --- getInstructionalMaterials-materials --- */
    builder.addCase(
      getInstructionalMaterials.fulfilled,
      (state, action: PayloadAction<InstructionalMaterialsType[]>) => {
        state.instructionalMaterials = action.payload;
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );

    /* createInstructionalMaterials */
    builder.addCase(
      createInstructionalMaterials.fulfilled,
      (state, action: PayloadAction<InstructionalMaterialsType>) => {
        if (!state.instructionalMaterials) return;
        state.instructionalMaterials.push(action.payload);
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );

    /* updateInstructionalMaterials */
    builder.addCase(
      updateInstructionalMaterials.fulfilled,
      (state, action: PayloadAction<InstructionalMaterialsType>) => {
        if (!state.instructionalMaterials) return;
        const instructionalMaterials = state.instructionalMaterials.map((el) => {
          if (el.id === action.payload.id) {
            return { ...el, ...action.payload };
          }
          return el;
        });

        state.instructionalMaterials = instructionalMaterials;
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );
    /* importInstructionalMaterials */
    builder.addCase(
      importInstructionalMaterials.fulfilled,
      (state, action: PayloadAction<InstructionalMaterialsType[]>) => {
        state.instructionalMaterials = action.payload;
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );

    /* deleteInstructionalMaterials */
    builder.addCase(deleteInstructionalMaterials.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.instructionalMaterials) return;
      const instructionalMaterials = state.instructionalMaterials.filter((el) => el.id !== action.payload);
      state.instructionalMaterials = instructionalMaterials;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* --- lessons --- */

    /* findAllTeacherLessonsById */
    builder.addCase(findAllTeacherLessonsById.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      state.filterLesson = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    // Для instruction-materials
    /* findAllTeacherLessonsByIdAndYear */
    builder.addCase(findAllTeacherLessonsByIdAndYear.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      state.filterLesson = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* --- teacher workload --- */

    /* getTeacherLoadById */
    builder.addCase(getTeacherLoadById.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      state.workload = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* --- individual-teacher-work --- */

    /* getIndividualTeacherWork */
    builder.addCase(getIndividualTeacherWork.fulfilled, (state, action: PayloadAction<IndividualWorkPlanType[]>) => {
      state.individualWorkPlan = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* createIndividualTeacherWork */
    builder.addCase(createIndividualTeacherWork.fulfilled, (state, action: PayloadAction<IndividualWorkPlanType>) => {
      if (!state.individualWorkPlan) return;
      state.individualWorkPlan.push(action.payload);
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* updateIndividualTeacherWork */
    builder.addCase(updateIndividualTeacherWork.fulfilled, (state, action: PayloadAction<IndividualWorkPlanType>) => {
      if (!state.individualWorkPlan) return;
      const individualWorkPlan = state.individualWorkPlan.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload };
        }
        return el;
      });

      state.individualWorkPlan = individualWorkPlan;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* deleteIndividualTeacherWork */
    builder.addCase(deleteIndividualTeacherWork.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.individualWorkPlan) return;
      const individualWorkPlan = state.individualWorkPlan.filter((el) => el.id !== action.payload);
      state.individualWorkPlan = individualWorkPlan;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* --- teacher-report --- */

    /* getTeacherReport */
    builder.addCase(getTeacherReport.fulfilled, (state, action: PayloadAction<TeacherReportType[]>) => {
      state.report = action.payload;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* createTeacherReport */
    builder.addCase(createTeacherReport.fulfilled, (state, action: PayloadAction<TeacherReportType>) => {
      if (!state.report) return;
      state.report.push(action.payload);
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* updateTeacherReport */
    builder.addCase(updateTeacherReport.fulfilled, (state, action: PayloadAction<TeacherReportType>) => {
      if (!state.report) return;
      const report = state.report.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload };
        }
        return el;
      });

      state.report = report;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });

    /* uploadTeacherReportFile */
    builder.addCase(
      uploadTeacherReportFile.fulfilled,
      (state, action: PayloadAction<TeacherReportUploadFileResponceType>) => {
        if (!state.report) return;
        const report = state.report.map((el) => {
          if (el.id === action.payload.id) {
            return { ...el, ...action.payload };
          }
          return el;
        });

        state.report = report;
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );

    /* deleteTeacherReportFile */
    builder.addCase(
      deleteTeacherReportFile.fulfilled,
      (state, action: PayloadAction<TeacherReportUploadFileResponceType>) => {
        if (!state.report) return;
        const report = state.report.map((el) => {
          if (el.id === action.payload.id) {
            return { ...el, ...action.payload };
          }
          return el;
        });

        state.report = report;
        state.loadingStatus = LoadingStatusTypes.SUCCESS;
      },
    );

    /* deleteTeacherReport */
    builder.addCase(deleteTeacherReport.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.report) return;
      const report = state.report.filter((el) => el.id !== action.payload);
      state.report = report;
      state.loadingStatus = LoadingStatusTypes.SUCCESS;
    });
  },
});

export const { setLoadingStatus, clearTeacherReports, clearIndividualTeacherWork } = teacherProfileSlice.actions;

export default teacherProfileSlice.reducer;

export const teacherProfileSelector = (state: RootState) => state.teacherProfile;
