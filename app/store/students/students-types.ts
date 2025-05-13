import { LoadingStatusTypes } from "../app-types";

export type StudentsInitialState = {
  students: StudentType[] | null;
  // lessonStudents: StudentType[] | null
  loadingStatus: LoadingStatusTypes;
};

export type StudentType = {
  id: number;
  name: string;
  login: string;
  password: string;
  email: string;
  status: "Навчається" | "Відраховано" | "Академічна відпустка";
  group: { id: number; name: string };
};
