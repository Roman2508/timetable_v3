import { LoadingStatusTypes } from "../app-types";
import { type StudentType } from "../students/students-types";
import { type TeachersType } from "../teachers/teachers-types";

export type AuthInitialState = {
  user: UserType | null;
  users: UserType[] | null;
  loadingStatus: LoadingStatusTypes;
};

export enum UserRoles {
  ADMIN = "ADMIN",
  GUEST = "GUEST",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  HEAD_OF_DEPARTMENT = "HEAD_OF_DEPARTMENT",
  METHODIST = "METHODIST",
}

export type UserType = {
  id: number;
  login: string; // ??????
  email: string;
  role: (typeof userRoles)[number][];
  picture: string | null;
  lastLogin: string | null;
  createdAt: string | null;
  // role: ['ADMIN' | 'GUEST' | 'TEACHER' | 'STUDENT' | 'HEAD_OF_DEPARTMENT' | 'METHODIST']
  teacher: TeachersType | null;
  student: StudentType | null;
};

export const userRoles = ["ADMIN", "GUEST", "TEACHER", "STUDENT", "HEAD_OF_DEPARTMENT", "METHODIST"] as const;
