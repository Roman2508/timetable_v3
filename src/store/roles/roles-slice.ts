import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { RootState } from "../app-types"
import { LoadingStatusTypes } from "../app-types"
import type { PermissionType, UserRolesType } from "@/api/api-types"
import {
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  getAllRoles,
  getFullRole,
  updateRole,
} from "./roles-async-actions"
import type { RolesInitialState, RoleType } from "./roles-types"

const rolesInitialState: RolesInitialState = {
  roles: null,
  role: null,
  loadingStatus: LoadingStatusTypes.NEVER,
}

const rolesSlice = createSlice({
  name: "roles",
  initialState: rolesInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload
    },

    setRoles(state, action: PayloadAction<Omit<UserRolesType, "permissions">[]>) {
      state.roles = action.payload
    },

    clearRole(state) {
      state.role = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRoles.fulfilled, (state, action: PayloadAction<RoleType[]>) => {
      state.roles = action.payload
    })

    builder.addCase(getFullRole.fulfilled, (state, action: PayloadAction<UserRolesType>) => {
      state.role = action.payload
    })

    builder.addCase(createRole.fulfilled, (state, action: PayloadAction<RoleType>) => {
      if (!state.roles) return
      state.roles.push(action.payload)
    })

    builder.addCase(updateRole.fulfilled, (state, action: PayloadAction<RoleType>) => {
      if (!state.roles) return
      const roles = state.roles.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload }
        }
        return el
      })
      state.roles = roles
    })

    builder.addCase(deleteRole.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.roles) return
      const roles = state.roles.filter((el) => el.id !== action.payload)
      state.roles = roles
    })

    /* permissions */
    builder.addCase(createPermission.fulfilled, (state, action: PayloadAction<PermissionType>) => {
      if (!state.role) return
      state.role.permissions.push(action.payload)
    })

    builder.addCase(deletePermission.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.role) return
      const permissions = state.role.permissions.filter((el) => el.id !== action.payload)
      state.role.permissions = permissions
    })
  },
})

export const { setLoadingStatus, setRoles, clearRole } = rolesSlice.actions

export default rolesSlice.reducer

export const rolesSelector = (state: RootState) => state.roles
