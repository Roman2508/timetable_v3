import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../app-types";
import { LoadingStatusTypes } from "../app-types";
import { getAllRoles } from "./roles-async-actions";
import type { RolesInitialState, RoleType } from "./roles-types";

const rolesInitialState: RolesInitialState = {
  roles: null,
  loadingStatus: LoadingStatusTypes.NEVER,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState: rolesInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload;
    },

    setRoles(state, action: PayloadAction<RoleType[]>) {
      state.roles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRoles.fulfilled, (state, action: PayloadAction<RoleType[]>) => {
      state.roles = action.payload;
    });
  },
});

export const { setLoadingStatus, setRoles } = rolesSlice.actions;

export default rolesSlice.reducer;

export const rolesSelector = (state: RootState) => state.roles;
