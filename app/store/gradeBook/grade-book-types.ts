import { LoadingStatusTypes } from "../app-types";
import { type StudentType } from "../students/students-types";
import { LessonsTypeRu } from "../schedule-lessons/schedule-lessons-types";
import { type GroupLoadType, type GroupsType } from "../groups/groups-types";
import { type InstructionalMaterialsType } from "../teacher-profile/teacher-profile-types";

export type GradeBookInitialStateType = {
  gradeBook: GradeBookType | null;
  lessonThemes: InstructionalMaterialsType[] | null;
  loadingStatus: LoadingStatusTypes;
};

export type GradeBookType = {
  id: number;
  year: number;
  semester: number;
  typeRu: LessonsTypeRu;
  lesson: GroupLoadType;
  group: GroupsType;
  grades: StudentGradesType[];
  summary: GradeBookSummaryType[];
};

export type StudentGradesType = {
  id: number;
  student: StudentType;
  gradeBook: GradeBookType;
  grades: GradeType[];
};

export type GradeType = {
  lessonNumber: number;
  isAbsence: boolean;
  rating: number;
  summaryType: null | GradeBookSummaryTypes;
};

export type GradeBookSummaryType = {
  afterLesson: number;
  type: GradeBookSummaryTypes;
};

export enum GradeBookSummaryTypes {
  MODULE_AVERAGE = "MODULE_AVERAGE",
  MODULE_SUM = "MODULE_SUM",
  LESSON_AVERAGE = "LESSON_AVERAGE",
  LESSON_SUM = "LESSON_SUM",
  MODULE_TEST = "MODULE_TEST",
  ADDITIONAL_RATE = "ADDITIONAL_RATE",
  CURRENT_RATE = "CURRENT_RATE",
  EXAM = "EXAM",
}
