import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { RootState } from "../app-types"
import type { GeneralSliceInitialState, StudentsStatusType } from "./general-types"

const generalInitialState: GeneralSliceInitialState = {
  sidebar: { open: true, expandedItems: ["1"] },

  groups: { status: "Всі", categories: [], orderField: "", isOrderDesc: false },
  auditories: { status: "Всі", categories: [], orderField: "", isOrderDesc: false },
  teachers: { status: "Всі", categories: [], orderField: "", isOrderDesc: false },
  plans: { status: "Всі", categories: [], expanded: [] },

  students: { status: "Всі" },

  streams: { semesters: "" },

  timetable: { semester: 1, week: 1, item: null, category: null, type: null, weeksPerPage: 7 },
}

const generalSlice = createSlice({
  name: "general",
  initialState: generalInitialState,
  reducers: {
    changeExpandSidebarItems(state, action: PayloadAction<string>) {
      const isExpanded = state.sidebar.expandedItems.some((el) => el === action.payload)

      if (isExpanded) {
        const newItems = state.sidebar.expandedItems.filter((el) => el !== action.payload)
        state.sidebar.expandedItems = newItems
      } else {
        state.sidebar.expandedItems.push(action.payload)
      }
    },
    toggleExpandedSidebarItems(state, action: PayloadAction<string[]>) {
      state.sidebar.expandedItems = action.payload
    },
    setSidebarState(state, action) {
      state.sidebar.open = action.payload
    },

    setGroupFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.groups.categories = action.payload
    },
    setGroupStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.groups.status = action.payload
    },
    setGroupsOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.groups.orderField = action.payload.id
      state.groups.isOrderDesc = action.payload.desc
    },

    setAuditoryFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.auditories.categories = action.payload
    },
    setAuditoryStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.auditories.status = action.payload
    },
    setAuditoryOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.auditories.orderField = action.payload.id
      state.auditories.isOrderDesc = action.payload.desc
    },

    setTeacherFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.teachers.categories = action.payload
    },
    setTeacherStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.teachers.status = action.payload
    },
    setTeacherOrder(state, action: PayloadAction<{ id: string; desc: boolean }>) {
      state.teachers.orderField = action.payload.id
      state.teachers.isOrderDesc = action.payload.desc
    },

    setPlanStatus(state, action: PayloadAction<"Всі" | "Активний" | "Архів">) {
      state.plans.status = action.payload
    },
    setPlanFilters(state, action: PayloadAction<{ id: number }[]>) {
      state.plans.categories = action.payload
    },
    setPlanExpanded(state, action: PayloadAction<{ id: number }[]>) {
      state.plans.expanded = action.payload
    },

    setStudentsStatus(state, action: PayloadAction<StudentsStatusType>) {
      state.students.status = action.payload
    },

    setStreamFilters(state, action: PayloadAction<string>) {
      state.streams.semesters = action.payload
    },

    setTimetableData(state, action: PayloadAction<Partial<GeneralSliceInitialState["timetable"]>>) {
      state.timetable = { ...state.timetable, ...action.payload }
    },
  },
})

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
  setStreamFilters,
  setTeacherStatus,
  setTimetableData,
  setTeacherFilters,
  setAuditoryStatus,
  setStudentsStatus,
  setAuditoryFilters,
  changeExpandSidebarItems,
  toggleExpandedSidebarItems,
} = generalSlice.actions

export const generalSelector = (state: RootState) => state.general

export default generalSlice.reducer
