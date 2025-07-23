import type { RootState } from "../app-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type StatusTypes = "success" | "info" | "error" | "";

type InitialStateType = {
  message: string;
  status: StatusTypes;
};

const initialState: InitialStateType = {
  message: "",
  status: "",
};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {
    setAppAlert(state, action: PayloadAction<InitialStateType>) {
      state.message = action.payload.message;
      state.status = action.payload.status;
    },
    clearAppAlert(state) {
      state.message = "";
      state.status = "";
    },
  },
});

export const { setAppAlert, clearAppAlert } = appStatusSlice.actions;

export const selectAppStatus = (state: RootState) => state.appStatus;

export default appStatusSlice.reducer;
