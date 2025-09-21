import {
  type AddStudentToLessonType,
  type AttachTeacherPayloadType,
  type CreateSubgroupsPayloadType,
  type DeleteStudentFromLessonType,
  type AttachSpecializationPayloadType,
  type AddStudentsToAllGroupLessonsType,
  type FindLessonsForSchedulePayloadType,
  type DeleteStudentsFromAllGroupLessonsType,
  type FindGroupLoadLessonsByGroupIdAndSemesterPayloadType,
} from "./api-types";
import { instanse } from "./api";
import { type GroupLoadType } from "../store/groups/groups-types";
import { type StudentType } from "../store/students/students-types";
import { type TeachersType } from "../store/teachers/teachers-types";

export const groupLoadLessonsAPI = {
  /* Specialization */
  attachSpecialization(payload: AttachSpecializationPayloadType) {
    return instanse.patch<AttachSpecializationPayloadType>(`/group-load-lessons/specialization`, payload);
  },

  /* Students */
  addStudentsToLesson(payload: AddStudentToLessonType) {
    return instanse.patch<StudentType[]>("/group-load-lessons/students/add", payload);
  },

  deleteStudentsFromLesson(payload: DeleteStudentFromLessonType) {
    return instanse.patch<StudentType[]>("/group-load-lessons/students/delete", payload);
  },

  addStudentsToAllGroupLessons(payload: AddStudentsToAllGroupLessonsType) {
    return instanse.patch<StudentType[]>("/group-load-lessons/students/all/add", payload);
  },

  deleteStudentsFromAllGroupLessons(payload: DeleteStudentsFromAllGroupLessonsType) {
    return instanse.patch<StudentType[]>("/group-load-lessons/students/all/delete", payload);
  },

  /* Subgroups */
  createSubgroups(payload: CreateSubgroupsPayloadType) {
    return instanse.patch<GroupLoadType[]>(`/group-load-lessons/subgroups`, payload);
  },

  /* teachers */
  attachTeacher(payload: AttachTeacherPayloadType) {
    return instanse.patch<{ lessonId: number; teacher: TeachersType }>(
      `/group-load-lessons/attach-teacher/${payload.lessonId}/${payload.teacherId}`,
    );
  },

  unpinTeacher(lessonId: number) {
    return instanse.patch<{ lessonId: number }>(`/group-load-lessons/unpin-teacher/${lessonId}`);
  },

  /* group load */
  getGroupLoadByCurrentCourse(id: number) {
    return instanse.get<GroupLoadType[]>(`/group-load-lessons/by-current-cours/${id}`);
  },

  findAllTeacherLessonsById(teacherId: number) {
    return instanse.get<GroupLoadType[]>(`/group-load-lessons/teacher/${teacherId}`);
  },

  findAllTeacherLessonsByIdAndYear(payload: { teacherId: number; year: number }) {
    return instanse.get<GroupLoadType[]>(
      `/group-load-lessons/instructional-materials/${payload.teacherId}/${payload.year}`,
    );
  },

  findLessonsForSchedule(payload: FindLessonsForSchedulePayloadType) {
    const { semester, itemId, scheduleType } = payload;
    return instanse.get<GroupLoadType[]>(`/group-load-lessons/${semester}/${scheduleType}/${itemId}`);
  },
  /* 
    findLessonsForSchedule(payload: FindLessonsForSchedulePayloadType) {
      const { semester, itemId, scheduleType } = payload
      return instanse.get<GroupLoadType[]>(`/group-load-lessons/${semester}/${scheduleType}/${itemId}`)
    },
   */
  findGroupLoadLessonsByGroupIdAndSemester(payload: FindGroupLoadLessonsByGroupIdAndSemesterPayloadType) {
    const { semester, groupId } = payload;
    return instanse.get<GroupLoadType[]>(`/group-load-lessons/${semester}/${groupId}`);
  },

  getLessonStudents(id: number) {
    return instanse.get<StudentType[]>(`/group-load-lessons/students/get/${id}`);
  },
};
