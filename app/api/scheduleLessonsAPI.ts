import {
  CopyDaySchedulePayloadType,
  GetGroupOverlayPayloadType,
  CopyWeekSchedulePayloadType,
  CreateReplacementPayloadType,
  GetAuditoryOverlayPayloadType,
  GetScheduleLessonsPayloadType,
  GetTeachersOverlayPayloadType,
  UpdateScheduleLessonsPayloadType,
  CreateScheduleLessonsPayloadType,
  FindAllLessonDatesForTheSemesterPayloadType,
} from "./apiTypes";
import { instanse } from "./api";
import { TeachersType } from "../store/teachers/teachers-types";
import { ScheduleLessonType } from "../store/schedule-lessons/schedule-lessons-types";

export const scheduleLessonsAPI = {
  getLessons(payload: GetScheduleLessonsPayloadType) {
    const { semester, type, id } = payload;
    return instanse.get<ScheduleLessonType[]>(`/schedule-lessons/${semester}/${type}/${id}`);
  },
  getAuditoryOverlay(payload: GetAuditoryOverlayPayloadType) {
    const { date, lessonNumber, auditoryId } = payload;
    return instanse.get<{ id: number; name: string }[]>(
      `/schedule-lessons/overlay/${date}/${lessonNumber}/${auditoryId}`,
    );
  },
  getGroupOverlay(payload: GetGroupOverlayPayloadType) {
    const { semester, groupId } = payload;
    return instanse.get<ScheduleLessonType[]>(`/schedule-lessons/${semester}/group/${groupId}`);
  },
  getTeacherOverlay(payload: GetTeachersOverlayPayloadType) {
    const { date, lessonNumber } = payload;
    return instanse.get<TeachersType[]>(`/schedule-lessons/overlay/teacher/${date}/${lessonNumber}`);
  },
  create(payload: CreateScheduleLessonsPayloadType) {
    return instanse.post<ScheduleLessonType>(`/schedule-lessons`, payload);
  },

  copyWeekSchedule(payload: CopyWeekSchedulePayloadType) {
    return instanse.post<ScheduleLessonType[]>(`/schedule-lessons/copy-week`, payload);
  },
  copyDaySchedule(payload: CopyDaySchedulePayloadType) {
    return instanse.post<ScheduleLessonType[]>(`/schedule-lessons/copy-day`, payload);
  },

  createReplacement(payload: CreateReplacementPayloadType) {
    return instanse.patch<{ id: number; teacher: TeachersType }>(`/schedule-lessons/replacement`, payload);
  },
  deleteReplacement(id: number) {
    return instanse.delete<number>(`/schedule-lessons/replacement/${id}`);
  },

  update(payload: UpdateScheduleLessonsPayloadType) {
    const { id, ...rest } = payload;
    return instanse.patch<ScheduleLessonType>(`/schedule-lessons/${id}`, rest);
  },
  delete(id: number) {
    return instanse.delete<number>(`/schedule-lessons/${id}`);
  },

  findAllLessonDatesForTheSemester(payload: FindAllLessonDatesForTheSemesterPayloadType) {
    return instanse.get<{ date: string }[]>(`/schedule-lessons/dates`, { params: { ...payload } });
  },
};
