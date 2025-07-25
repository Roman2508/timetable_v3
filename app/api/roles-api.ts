import {
  type UserRolesType,
  type CreateRolePayloadType,
  type UpdateRolePayloadType,
  type CreatePermissionPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type PlansType } from "../store/plans/plans-types";

export const rolesAPI = {
  /* roles */
  getAll() {
    return instanse.get<Omit<UserRolesType, "permissions">[]>("/roles");
  },
  getFull(id: number) {
    return instanse.get<UserRolesType>(`/roles/${id}`);
  },
  createRole(payload: CreateRolePayloadType) {
    return instanse.post<Omit<UserRolesType, "permissions">>("/roles", payload);
  },
  updateRole(payload: UpdateRolePayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<Omit<UserRolesType, "permissions">>(`/roles/${id}`, rest);
  },
  deleteRole(id: number) {
    return instanse.delete<number>(`/roles/${id}`);
  },

  /* permissions */
  createPlan(payload: CreatePermissionPayloadType) {
    return instanse.post<PlansType>("/roles/permission", payload);
  },
  deletePlan(id: number) {
    return instanse.delete<number>(`/roles/permission/${id}`);
  },
};
