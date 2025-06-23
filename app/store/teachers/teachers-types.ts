import { LoadingStatusTypes } from "../app-types";

export type TeachersInitialState = {
  teachersCategories: TeachersCategoryType[] | null;
  loadingStatus: LoadingStatusTypes;
};

export type TeachersCategoryType = {
  id: number;
  name: string;
  shortName: string;
  teachers: TeachersType[];
};

export type TeachersType = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  calendarId: string;
  folderId: string;
  isHide: boolean;
  position: string;
  bio: EditorJSItemType[];
  status: "Активний" | "Архів";
  printedWorks: EditorJSItemType[];
  category: { id: number; name: string; shortName: string };
  user: { id: number; email: string; lastLogin: string };
};

export type EditorJSItemType = {
  id: string;
  type: string;
  data: EditorJSItemTextDataType | EditorJSItemListDataType;
};

export type EditorJSItemTextDataType = {
  text: string;
};

export type EditorJSItemListDataType = {
  items: string[];
  style: string;
};
