import { instanse } from "./api";
import { type SettingsType } from "../store/settings/settings-types";
import {
  type UpdateColorsPayloadType,
  type UpdateCallSchedulePayloadType,
  type UpdateSemesterTermsPayloadType,
} from "./api-types";

export const settingsAPI = {
  getSettings(id: number = 1) {
    return instanse.get<SettingsType>(`/settings/${id}`);
  },
  updateSettings(payload: SettingsType) {
    const { id, ...rest } = payload;
    return instanse.patch<SettingsType>(`/settings/${id}`, rest);
  },
  updateColors(payload: UpdateColorsPayloadType) {
    return instanse.patch<SettingsType>(`/settings/colors`, payload);
  },
  updateCallSchedule(payload: UpdateCallSchedulePayloadType) {
    return instanse.patch<SettingsType>(`/settings/call-schedule`, payload);
  },
  updateSemesterTerms(payload: UpdateSemesterTermsPayloadType) {
    return instanse.patch<SettingsType>(`/settings/semester-terms`, payload);
  },
};
