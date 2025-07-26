import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  type LoginPayloadType,
  type AuthResponseType,
  type RegisterPayloadType,
  type GetUsersPayloadType,
  type UpdateEditorDataType,
  type UpdateUserPayloadType,
  type CreateUserPayloadType,
  type GoogleLoginPayloadType,
} from "../../api/api-types";
import { authAPI } from "../../api/auth-api";
import { LoadingStatusTypes } from "../app-types";
import { rolesAPI } from "~/api/roles-api";
import { setLoadingStatus } from "./roles-slice";

export const getAllRoles = createAsyncThunk("roles/getAll", async (_, thunkAPI): Promise<any> => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING));
  const promise = rolesAPI.getAll();

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR));
      return (error as any)?.response?.data?.message || error.message;
    },
  });

  const { data } = await promise;
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS));
  return data;
});
