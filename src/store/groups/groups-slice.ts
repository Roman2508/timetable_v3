import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

import {
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup,
  createSubgroups,
  getGroupCategories,
  handleGroupVisible,
  updateGroupCategory,
  createGroupCategory,
  deleteGroupCategory,
  attachSpecialization,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  incrementAllGroupsCourse,
  decrementAllGroupsCourse,
} from "./groups-async-actions"
import { LoadingStatusTypes, type RootState } from "../app-types"
import { type AttachSpecializationPayloadType } from "../../api/api-types"
import { type GroupsType, type GroupLoadType, type GroupsInitialState, type GroupCategoriesType } from "./groups-types"

const emptyGroupData: GroupsInitialState["group"] = {
  id: 0,
  name: "",
  courseNumber: 1,
  yearOfAdmission: Number(new Date().getFullYear().toString()),
  students: [],
  isHide: false,
  calendarId: "",
  status: "Активний",
  formOfEducation: "Денна",
  specializationList: [],
  educationPlan: null,
  groupLoad: null,
  category: null,
  stream: [],
}

const groupsInitialState: GroupsInitialState = {
  groupCategories: null,
  group: emptyGroupData,
  loadingStatus: LoadingStatusTypes.NEVER,
}

const groupsSlice = createSlice({
  name: "groups",
  initialState: groupsInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload
    },
    setGroupCategories(state, action: PayloadAction<GroupCategoriesType[]>) {
      state.groupCategories = action.payload
    },
    setGroup(state, action: PayloadAction<GroupsType | undefined>) {
      if (action.payload) state.group = action.payload
      else state.group = emptyGroupData
    },
    clearGroupData(state) {
      state.group = groupsInitialState.group
    },
  },
  extraReducers: (builder) => {
    /* getGroupCategories */
    builder.addCase(getGroupCategories.fulfilled, (state, action: PayloadAction<GroupCategoriesType[]>) => {
      state.groupCategories = action.payload
    })

    /* createGroupCategory */
    builder.addCase(createGroupCategory.fulfilled, (state, action: PayloadAction<GroupCategoriesType>) => {
      state.groupCategories?.push(action.payload)
    })

    /* updateGroupCategory */
    builder.addCase(updateGroupCategory.fulfilled, (state, action: PayloadAction<GroupCategoriesType>) => {
      if (!state.groupCategories) return

      const newCategories = state.groupCategories.map((el) => {
        if (el.id === action.payload.id) {
          return { ...el, ...action.payload }
        }

        return el
      })

      state.groupCategories = newCategories
    })

    /* deleteGroupCategory */
    builder.addCase(deleteGroupCategory.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.groupCategories) return

      const newCategories = state.groupCategories.filter((el) => el.id !== action.payload)

      state.groupCategories = newCategories
    })

    /* --- groups --- */

    /* getGroup */
    builder.addCase(getGroup.fulfilled, (state, action: PayloadAction<GroupsType>) => {
      state.group = action.payload
    })

    /* createGroup */
    builder.addCase(createGroup.fulfilled, (state, action: PayloadAction<GroupsType>) => {
      if (!state.groupCategories) return

      const newGroups = state.groupCategories.map((el) => {
        if (el.id === action.payload.category?.id) {
          return { ...el, groups: [...el.groups, action.payload] }
        }

        return el
      })

      state.groupCategories = newGroups
    })

    /* updateGroup */
    builder.addCase(updateGroup.fulfilled, (state, action: PayloadAction<GroupsType>) => {
      if (!state.groupCategories) return

      const newGroups = state.groupCategories.map((el) => {
        if (el.id === action.payload.category?.id) {
          const newGroups = el.groups.map((group) => {
            if (group.id === action.payload.id) {
              return action.payload
            }

            return group
          })

          return { ...el, groups: newGroups }
        }

        return el
      })
      state.group = action.payload
      state.groupCategories = newGroups
    })

    builder.addCase(incrementAllGroupsCourse.fulfilled, (state, _: PayloadAction<GroupsType[]>) => {
      if (!state.groupCategories) return

      const groupCategories = state.groupCategories.map((category) => {
        const groups = category.groups.map((group) => {
          return { ...group, courseNumber: group.courseNumber + 1 }
        })

        return { ...category, groups }
      })

      state.groupCategories = groupCategories
    })

    builder.addCase(decrementAllGroupsCourse.fulfilled, (state, _: PayloadAction<GroupsType[]>) => {
      if (!state.groupCategories) return

      const groupCategories = state.groupCategories.map((category) => {
        const groups = category.groups.map((group) => {
          return { ...group, courseNumber: group.courseNumber - 1 }
        })

        return { ...category, groups }
      })

      state.groupCategories = groupCategories
    })

    /* deleteGroup */
    builder.addCase(deleteGroup.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.groupCategories) return

      const updatedCategories = state.groupCategories.map((el) => {
        const newGroups = el.groups.filter((group) => group.id !== action.payload)

        return { ...el, groups: newGroups }
      })

      state.group = emptyGroupData
      state.groupCategories = updatedCategories
    })

    /* handleGroupVisible */
    builder.addCase(handleGroupVisible.fulfilled, (state, action: PayloadAction<{ id: number; isHide: boolean }>) => {
      if (!state.groupCategories) return

      const updatedCategories = state.groupCategories.map((el) => {
        const newGroups = el.groups.filter((group) => group.id !== action.payload.id)
        return { ...el, groups: newGroups }
      })

      state.groupCategories = updatedCategories
    })

    /* specialization */

    /* attachSpecialization */
    builder.addCase(attachSpecialization.fulfilled, (state, action: PayloadAction<AttachSpecializationPayloadType>) => {
      if (!state.group || !state.group.groupLoad) return

      const { groupId, planSubjectId, name } = action.payload

      const groupLoad = state.group.groupLoad.map((el) => {
        if (el.group.id === groupId && el.planSubjectId.id === planSubjectId) {
          return { ...el, specialization: name }
        }
        return el
      })

      state.group.groupLoad = groupLoad
    })

    /* createSpecialization */
    builder.addCase(createSpecialization.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.group.specializationList = action.payload
    })

    /* updateSpecialization */
    builder.addCase(updateSpecialization.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.group.specializationList = action.payload
    })

    /* deleteSpecialization */
    builder.addCase(deleteSpecialization.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.group.specializationList = action.payload
    })

    /* createSubgroups */
    builder.addCase(createSubgroups.fulfilled, (state, action: PayloadAction<GroupLoadType[]>) => {
      if (!state.group || !state.group.groupLoad) return
      // Якщо змінити одразу 2 або більше видів занять - змінюється порядок елементів в масиві
      // Якщо змінити одразу 2 або більше видів занять - змінюється порядок елементів в масиві
      // Якщо змінити одразу 2 або більше видів занять - змінюється порядок елементів в масиві
      // Якщо змінити одразу 2 або більше видів занять - змінюється порядок елементів в масиві
      // Якщо змінити одразу 2 або більше видів занять - змінюється порядок елементів в масиві

      // groupsSlice.ts:203 Uncaught (in promise) TypeError: Cannot destructure property 'planSubjectId' of 'action.payload[0]' as it is undefined.
      const lessons = state.group.groupLoad.filter((el) => {
        const { planSubjectId, typeEn, semester } = action.payload[0]

        const bool = el.planSubjectId.id === planSubjectId.id && el.typeEn === typeEn && el.semester === semester

        return !bool
      })

      state.group.groupLoad = [...lessons, ...action.payload]
    })
  },
})

export const groupsSelector = (state: RootState) => state.groups

export const { setLoadingStatus, clearGroupData, setGroupCategories, setGroup } = groupsSlice.actions

export default groupsSlice.reducer
