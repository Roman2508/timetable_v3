import { type PayloadAction, createSlice } from "@reduxjs/toolkit"

import {
  createAuditory,
  deleteAuditory,
  updateAuditory,
  getAuditoryCategories,
  createAuditoryCategory,
  deleteAuditoryCategory,
  updateAuditoryCategory,
  getAuditory,
} from "./auditories-async-actions"
import type { RootState } from "../app-types"
import { LoadingStatusTypes } from "../app-types"
import { type AuditoryCategoriesTypes, type AuditoriesInitialState, type AuditoriesTypes } from "./auditories-types"

const auditoriesInitialState: AuditoriesInitialState = {
  auditoriCategories: null,
  auditory: null,
  loadingStatus: LoadingStatusTypes.NEVER,
}

const auditoriesSlice = createSlice({
  name: "auditories",
  initialState: auditoriesInitialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.loadingStatus = action.payload
    },
    setAuditory(state, action: PayloadAction<AuditoriesTypes>) {
      state.auditory = action.payload
    },
    setAuditoryCategories(state, action: PayloadAction<AuditoryCategoriesTypes[]>) {
      state.auditoriCategories = action.payload
    },
  },
  extraReducers: (builder) => {
    /* --- categories --- */

    /* getAuditoryCategories */
    builder.addCase(getAuditoryCategories.fulfilled, (state, action: PayloadAction<AuditoryCategoriesTypes[]>) => {
      state.auditoriCategories = action.payload
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* createAuditoryCategory */
    builder.addCase(createAuditoryCategory.fulfilled, (state, action: PayloadAction<AuditoryCategoriesTypes>) => {
      state.auditoriCategories?.push(action.payload)
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* updateAuditoryCategory */
    builder.addCase(updateAuditoryCategory.fulfilled, (state, action: PayloadAction<AuditoryCategoriesTypes>) => {
      if (!state.auditoriCategories) return

      const newAuditories = state.auditoriCategories.map((el) => {
        if (el.id === action.payload.id) {
          return { ...action.payload }
        }

        return el
      })

      state.auditoriCategories = newAuditories
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* deleteAuditoryCategory */
    builder.addCase(deleteAuditoryCategory.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.auditoriCategories) return

      const newCategories = state.auditoriCategories.filter((el) => el.id !== action.payload)

      state.auditoriCategories = newCategories
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* --- auditories --- */
    
    /* getAuditory */
    builder.addCase(getAuditory.fulfilled, (state, action: PayloadAction<AuditoriesTypes>) => {
      state.auditory = action.payload
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* createAuditory */
    builder.addCase(createAuditory.fulfilled, (state, action: PayloadAction<AuditoriesTypes>) => {
      if (!state.auditoriCategories) return

      const newAuditories = state.auditoriCategories.map((el) => {
        if (el.id === action.payload.category.id) {
          return { ...el, auditories: [...el.auditories, action.payload] }
        }

        return el
      })

      state.auditoriCategories = newAuditories
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* updateAuditory */
    builder.addCase(updateAuditory.fulfilled, (state, action: PayloadAction<AuditoriesTypes>) => {
      if (!state.auditoriCategories) return

      let isChangeCategory = false

      const newCategories = state.auditoriCategories.map((el) => {
        const newAuditories = el.auditories.map((auditory) => {
          if (auditory.id === action.payload.id) {
            if (auditory.category.id === action.payload.category.id) {
              return action.payload
            }

            isChangeCategory = true
            return null
          }

          return auditory
        })

        const filtredAuditory = newAuditories.filter((el) => el !== null)
        return { ...el, auditories: filtredAuditory }
      })

      // Якщо категорія змінилась
      if (isChangeCategory) {
        const changedCategories = newCategories.map((el) => {
          if (el.id === action.payload.category.id) {
            const auditories = [...el.auditories, action.payload]
            return { ...el, auditories }
          }

          return el
        })
        state.auditoriCategories = changedCategories
      } else {
        state.auditoriCategories = newCategories
      }
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })

    /* deleteAuditory */
    builder.addCase(deleteAuditory.fulfilled, (state, action: PayloadAction<number>) => {
      if (!state.auditoriCategories) return

      const updatedCategories = state.auditoriCategories.map((el) => {
        const newAuditories = el.auditories.filter((auditory) => auditory.id !== action.payload)

        return { ...el, auditories: newAuditories }
      })

      state.auditoriCategories = updatedCategories
      state.loadingStatus = LoadingStatusTypes.SUCCESS
    })
  },
})

export const auditoriesSelector = (state: RootState) => state.auditories

export const { setLoadingStatus, setAuditoryCategories, setAuditory } = auditoriesSlice.actions

export default auditoriesSlice.reducer
