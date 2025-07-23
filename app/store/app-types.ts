import type { makeStore } from "./store";

export enum LoadingStatusTypes {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  NEVER = "NEVER",
  ERROR = "ERROR",
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
