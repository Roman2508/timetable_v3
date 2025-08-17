import type { store } from "./store"

export enum LoadingStatusTypes {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  NEVER = "NEVER",
  ERROR = "ERROR",
}

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
