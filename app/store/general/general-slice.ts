import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type RootState } from "../store";
import type { ChangeAlertDialogStateType, ChangeConfirmDialogStateType } from "./general-types";

const persist = {
  global: {
    drawerOpen: false,
    expandedNavGroups: ["/groups", "/plans"],
  },
  auth: {
    login: "aaa.aaa",
    email: "aaa@mail.com",
    avatar: "https://api.com/asdsdwdqw",
  },
  groups: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  teachers: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  auditories: {
    status: "all",
    categories: ["sadidjq83enfew", "dsofoi3fmrjngjn", "sadidjq83enfew", "dsofoi3fmrjngjn"],
    orderField: "",
    orderType: "",
  },
  plans: {},
  scheduleLessons: {},
  groupLoadLessons: {},
};

const initialState = {
  sidebar: {
    open: true,
    expandedItems: ["Структура"],
  },
  groups: {
    status: "Всі" as "Всі" | "Активний" | "Архів",
    categories: [] as { id: number }[],
    orderField: "",
    orderType: "",
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
  initialState,
  reducers: {
    activeItem(state, action) {
      // state.openItems = action.payload.openItem;
    },

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

export const generalSelector = (state: RootState) => state.general;

export default generalSlice.reducer;

export const {
  activeItem,
  setGroupStatus,
  setSidebarState,
  setGroupFilters,
  changeAlertModalStatus,
  changeConfirmModalStatus,
  changeExpandSidebarItems,
  toggleExpandedSidebarItems,
} = generalSlice.actions;
