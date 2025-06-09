import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  GeneralSliceInitialState,
  ChangeAlertDialogStateType,
  ChangeConfirmDialogStateType,
} from "./general-types";
import type { RootState } from "../store";

const generalInitialState: GeneralSliceInitialState = {
  sidebar: {
    open: true,
    expandedItems: ["Структура"],
  },
  groups: {
    status: "Всі",
    categories: [],
    orderField: "",
    isOrderDesc: false,
  },
  auditories: {
    status: "Всі",
    categories: [],
    orderField: "",
    isOrderDesc: false,
  },
  teachers: {
    status: "Всі",
    categories: [],
    orderField: "",
    isOrderDesc: false,
  },
  plans: {
    status: "Всі",
    categories: [],
    expanded: [],
  },

  confirmModal: {
    isOpen: false,
    title: "",
    itemName: "",
    description: "",
    answer: false,
    onConfirm: () => {},
  },
  alertModal: {
    isOpen: false,
    title: "",
    text: "",
  },
};

const generalSlice = createSlice({
  name: "general",
  initialState: generalInitialState,
  reducers: {
    changeExpandSidebarItems(state, action: PayloadAction<string>) {
      const isExpanded = state.sidebar.expandedItems.some((el) => el === action.payload);

      if (isExpanded) {
        const newItems = state.sidebar.expandedItems.filter((el) => el !== action.payload);
        state.sidebar.expandedItems = newItems;
      } else {
        state.sidebar.expandedItems.push(action.payload);
      }
    },
    toggleExpandedSidebarItems(state, action: PayloadAction<string[]>) {
      state.sidebar.expandedItems = action.payload;
    },
    setSidebarState(state, action) {
      state.sidebar.open = action.payload;
    },

    setGroupFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.groups.categories = action.payload;
    },
    setGroupStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.groups.status = action.payload;
    },
    setGroupsOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.groups.orderField = action.payload.id;
      state.groups.isOrderDesc = action.payload.desc;
    },

    setAuditoryFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.auditories.categories = action.payload;
    },
    setAuditoryStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.auditories.status = action.payload;
    },
    setAuditoryOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.auditories.orderField = action.payload.id;
      state.auditories.isOrderDesc = action.payload.desc;
    },

    setTeacherFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.teachers.categories = action.payload;
    },
    setTeacherStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.teachers.status = action.payload;
    },
    setTeacherOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.teachers.orderField = action.payload.id;
      state.teachers.isOrderDesc = action.payload.desc;
    },

    setPlanStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.plans.status = action.payload;
    },
    setPlanFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.plans.categories = action.payload;
    },
    setPlanExpanded(state, action: PayloadAction<{ id: number }[]>) {
      state.plans.expanded = action.payload;
    },

    changeConfirmModalStatus(state, action: PayloadAction<ChangeConfirmDialogStateType>) {
      const keys = Object.keys(action.payload);
      const { isOpen, answer, title, itemName, description, onConfirm } = action.payload;

      if (keys.includes("onConfirm")) state.confirmModal.onConfirm = onConfirm ?? (() => {});
      if (keys.includes("isOpen")) state.confirmModal.isOpen = isOpen ?? false;
      if (keys.includes("answer")) state.confirmModal.answer = answer ?? false;
      if (keys.includes("title")) state.confirmModal.title = title ?? "";
      if (keys.includes("itemName")) state.confirmModal.itemName = itemName ?? "";
      if (keys.includes("description")) state.confirmModal.description = description ?? "";
    },

    changeAlertModalStatus(state, action: PayloadAction<ChangeAlertDialogStateType>) {
      const keys = Object.keys(action.payload);
      const { isOpen, title, text } = action.payload;

      if (keys.includes("isOpen")) state.alertModal.isOpen = isOpen ?? false;
      if (keys.includes("title")) state.alertModal.title = title ?? "";
      if (keys.includes("text")) state.alertModal.text = text ?? "";
    },
  },
});

export const {
  setPlanStatus,
  setGroupStatus,
  setGroupsOrder,
  setPlanFilters,
  setSidebarState,
  setGroupFilters,
  setPlanExpanded,
  setTeacherOrder,
  setAuditoryOrder,
  setTeacherStatus,
  setTeacherFilters,
  setAuditoryStatus,
  setAuditoryFilters,
  changeAlertModalStatus,
  changeConfirmModalStatus,
  changeExpandSidebarItems,
  toggleExpandedSidebarItems,
} = generalSlice.actions;

export const generalSelector = (state: RootState) => state.general;

export default generalSlice.reducer;
