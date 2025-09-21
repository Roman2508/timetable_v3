import { LoadingStatusTypes } from "../app-types";
import { type GroupLoadType } from "../groups/groups-types";
import { type TeachersType } from "../teachers/teachers-types";

export type TeacherProfileInitialInitialState = {
  // Загальна інформація, Видавнича діяльність
  generalInfo: TeachersType | null;

  // Пед. навантаження
  workload: GroupLoadType[] | null;

  // Дисципліна в яку викладач вносить теми уроків (Навчально-методичні комплекси)
  // Дисципліни викладача за рік
  filterLesson: GroupLoadType[] | null;
  instructionalMaterials: InstructionalMaterialsType[] | null;

  individualWorkPlan: IndividualWorkPlanType[] | null;

  report: TeacherReportType[] | null;

  loadingStatus: LoadingStatusTypes;
};

export type InstructionalMaterialsType = {
  id: number;
  lesson: { id: number; name: string };
  lessonNumber: number;
  name: string; // Назва теми
};

export type IndividualWorkPlanType = {
  id: number;
  name: string;
  hours: number;
  type: IndividualTeacherWordTypes;
};

export type TeacherReportType = {
  id: number;
  hours: number;
  status: boolean;
  plannedDate: string;
  doneDate: string;
  description: string;
  files: TeacherReportFileType[];
  teacher: TeachersType;
  individualWork: IndividualWorkPlanType;
};

export type TeacherReportFileType = {
  id: string;
  name: string;
  mimeType: string;
};

export enum IndividualTeacherWordTypes {
  METHODICAL_WORK = "Методична робота",
  SCIENTIFIC_WORK = "Наукова робота",
  ORGANIZATIONAL_WORK = "Організаційна робота",
}
