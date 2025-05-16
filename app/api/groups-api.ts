import {
  type UpdateGroupPayloadType,
  type UpdateEntityNamePayloadType,
  type CreateSpecializationPayloadType,
  type DeleteSpecializationPayloadType,
  type UpdateSpecializationPayloadType,
  type CreateCategoryPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type GroupCategoriesType, type GroupsType } from "../store/groups/groups-types";

export const groupsAPI = {
  /* categories */
  getGroupsCategories() {
    return instanse.get<GroupCategoriesType[]>(`/group-categories`);
  },
  createGroupCategory(payload: CreateCategoryPayloadType) {
    return instanse.post<GroupCategoriesType>("/group-categories", payload);
  },
  updateGroupCategory(payload: UpdateEntityNamePayloadType) {
    return instanse.patch<GroupCategoriesType>(`/group-categories/${payload.id}`, {
      name: payload.name,
    });
  },
  deleteGroupCategory(id: number) {
    return instanse.delete<number>(`/group-categories/${id}`);
  },

  /* Groups */
  getGroup(id: string) {
    return instanse.get<GroupsType>(`/groups/${id}`);
  },

  createGroup(payload: UpdateGroupPayloadType) {
    return instanse.post<GroupsType>("/groups", payload);
  },
  updateGroup(payload: UpdateGroupPayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<GroupsType>(`/groups/${id}`, rest);
  },
  incrementAllGroupsCourse() {
    return instanse.patch<GroupsType[]>("/groups/increment-all-groups-course");
  },
  decrementAllGroupsCourse() {
    return instanse.patch<GroupsType[]>("/groups/decrement-all-groups-course");
  },
  deleteGroup(id: number) {
    return instanse.delete<number>(`/groups/${id}`);
  },
  handleGroupVisible(id: number) {
    return instanse.patch<{ id: number; isHide: boolean }>(`/groups/handle-visible/${id}`);
  },

  createSpecialization(payload: CreateSpecializationPayloadType) {
    return instanse.post<string[]>(`/groups/specialization`, payload);
  },

  updateSpecialization(payload: UpdateSpecializationPayloadType) {
    return instanse.patch<string[]>(`/groups/specialization`, payload);
  },

  deleteSpecialization(payload: DeleteSpecializationPayloadType) {
    return instanse.delete<string[]>(`/groups/specialization/${payload.groupId}/${payload.name}`);
  },
};
