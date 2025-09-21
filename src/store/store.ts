import { useDispatch } from "react-redux"
import storage from "redux-persist/lib/storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from "redux-persist"

import authReducer from "./auth/auth-slice"
import type { AppDispatch } from "./app-types"
import plansReducer from "./plans/plans-slice"
import rolesReducer from "./roles/roles-slice"
import groupsReducer from "./groups/groups-slice"
import streamsReducer from "./streams/streams-slice"
import generalReducer from "./general/general-slice"
import teachersReducer from "./teachers/teachers-slice"
import settingsReducer from "./settings/settings-slice"
import studentsReducer from "./students/students-slice"
import gradeBookReducer from "./gradeBook/grade-book-slice"
import appStatusReducer from "./app-status/app-status-slice"
import auditoriesReducer from "./auditories/auditories-slise"
import teacherProfileReducer from "./teacher-profile/teacher-profile-slice"
import scheduleLessonsReducer from "./schedule-lessons/schedule-lessons-slice"

export const rootReducer = combineReducers({
  auth: authReducer,
  roles: rolesReducer,
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
})

// export const makeStore = (preloadedState?: any) => {
//   return configureStore({ reducer: rootReducer, preloadedState });
// };

const persistConfig = {
  key: "timetable",
  storage,
  whitelist: ["general", "settings"],
  blacklist: [
    "auth",
    "roles",
    "plans",
    "groups",
    "streams",
    "students",
    "teachers",
    "gradeBook",
    "auditories",
    "teacherProfile",
    "scheduleLessons",
  ],
}

export const mainReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: mainReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export const useAppDispatch = () => useDispatch<AppDispatch>()
