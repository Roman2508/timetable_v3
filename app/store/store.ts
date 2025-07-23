import { useDispatch } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth-slice";
import plansReducer from "./plans/plans-slice";
import type { AppDispatch } from "./app-types";
import groupsReducer from "./groups/groups-slice";
import streamsReducer from "./streams/streams-slice";
import generalReducer from "./general/general-slice";
import teachersReducer from "./teachers/teachers-slice";
import settingsReducer from "./settings/settings-slice";
import studentsReducer from "./students/students-slice";
import gradeBookReducer from "./gradeBook/grade-book-slice";
import appStatusReducer from "./app-status/app-status-slice";
import auditoriesReducer from "./auditories/auditories-slise";
import teacherProfileReducer from "./teacher-profile/teacher-profile-slice";
import scheduleLessonsReducer from "./schedule-lessons/schedule-lessons-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  plans: plansReducer,
  groups: groupsReducer,
  streams: streamsReducer,
  general: generalReducer,
  students: studentsReducer,
  teachers: teachersReducer,
  settings: settingsReducer,
  appStatus: appStatusReducer,
  gradeBook: gradeBookReducer,
  auditories: auditoriesReducer,
  teacherProfile: teacherProfileReducer,
  scheduleLessons: scheduleLessonsReducer,
});

export const makeStore = (preloadedState: any = undefined) => {
  return configureStore({ reducer: rootReducer, preloadedState });
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
