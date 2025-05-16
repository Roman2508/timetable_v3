import { useDispatch } from "react-redux";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import menuSlice from "./menu/menu-slice";
import authSlice from "./auth/auth-slice";
import plansSlice from "./plans/plans-slice";
import groupsSlice from "./groups/groups-slice";
import streamsSlice from "./streams/streams-slice";
import teachersSlice from "./teachers/teachers-slice";
import settingsSlice from "./settings/settings-slice";
import studentsSlice from "./students/students-slice";
import appStatusSlice from "./app-status/app-status-slice";
import gradeBookSlice from "./gradeBook/grade-book-slice";
import auditoriesSlise from "./auditories/auditories-slise";
import teacherProfileSlice from "./teacher-profile/teacher-profile-slice";
import scheduleLessonsSlice from "./schedule-lessons/schedule-lessons-slice";

const menuPersistConfig = {
  key: "menu",
  storage: storage,
  whitelist: ["drawerOpen"],
};

const groupsPersistConfig = {
  key: "scheduleLessons",
  storage: storage,
  whitelist: [
    "lastOpenedWeek",
    "lastOpenedSemester",
    "lastSelectedItemId",
    "lastSelectedScheduleType",
    "lastSelectedStructuralUnitId",
  ],
};

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  plans: plansSlice,
  groups: groupsSlice,
  streams: streamsSlice,
  students: studentsSlice,
  teachers: teachersSlice,
  settings: settingsSlice,
  appStatus: appStatusSlice,
  gradeBook: gradeBookSlice,
  auditories: auditoriesSlise,
  teacherProfile: teacherProfileSlice,
  auth: authSlice,
  menu: menuSlice,
  scheduleLessons: scheduleLessonsSlice,
  // auth: persistReducer(authPersistConfig, authSlice),
  // menu: persistReducer(menuPersistConfig, menuSlice),
  // scheduleLessons: persistReducer(groupsPersistConfig, scheduleLessonsSlice),
});

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);

export const makeStore = (preloadedState = undefined) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // спростимо, можеш додати список винятків
      }),
    preloadedState,
  });

export const store = makeStore();

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
