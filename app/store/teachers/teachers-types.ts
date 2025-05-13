import { LoadingStatusTypes } from "../app-types";

export type TeachersInitialState = {
  teachersCategories: TeachersCategoryType[] | null;
  loadingStatus: LoadingStatusTypes;
};

export type TeachersCategoryType = {
  id: number;
  name: string;
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
  category: { id: number; name: string };
  position: string;
  bio: EditorJSItemType[];
  printedWorks: EditorJSItemType[];
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
