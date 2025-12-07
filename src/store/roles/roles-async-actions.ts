import { toast } from "sonner"
import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  type CreateRolePayloadType,
  type UpdateRolePayloadType,
  type CreatePermissionPayloadType,
} from "../../api/api-types"
import { rolesAPI } from "@/api/roles-api"
import { setLoadingStatus } from "./roles-slice"
import { LoadingStatusTypes } from "../app-types"

export const getAllRoles = createAsyncThunk("roles/getAll", async (_, thunkAPI): Promise<any> => {
  // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
  const promise = rolesAPI.getAll()

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "",
    error: (error) => {
      // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const getFullRole = createAsyncThunk("roles/getFullRole", async (id: number, thunkAPI): Promise<any> => {
  // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
  const promise = rolesAPI.getFull(id)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "",
    error: (error) => {
      // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  // thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (payload: CreateRolePayloadType, thunkAPI): Promise<any> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
    const promise = rolesAPI.createRole(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано нову роль",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (payload: UpdateRolePayloadType, thunkAPI): Promise<any> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
    const promise = rolesAPI.updateRole(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Роль оновлена",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const deleteRole = createAsyncThunk("roles/deleteRole", async (id: number, thunkAPI): Promise<any> => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
  const promise = rolesAPI.deleteRole(id)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Видалено роль",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

/* permissions */

export const createPermission = createAsyncThunk(
  "roles/createPermission",
  async (payload: CreatePermissionPayloadType, thunkAPI): Promise<any> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
    const promise = rolesAPI.createPermission(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Додано нове повноваження",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const deletePermission = createAsyncThunk(
  "roles/deletePermission",
  async (id: number, thunkAPI): Promise<any> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))
    const promise = rolesAPI.deletePermission(id)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Видалено повноваження для обраної ролі",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)
