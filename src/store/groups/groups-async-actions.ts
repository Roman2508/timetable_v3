import { toast } from "sonner"
import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  type UpdateGroupPayloadType,
  type CreateSubgroupsPayloadType,
  type CreateGroupCategoryPayloadType,
  type UpdateGroupCategoryPayloadType,
  type AttachSpecializationPayloadType,
  type CreateSpecializationPayloadType,
  type DeleteSpecializationPayloadType,
  type UpdateSpecializationPayloadType,
  type CreateGroupPayloadType,
  type FindGroupLoadLessonsByGroupIdAndSemesterPayloadType,
} from "../../api/api-types"
import { setLoadingStatus } from "./groups-slice"
import { LoadingStatusTypes } from "../app-types"
import { type GroupCategoriesType } from "./groups-types"
import { groupLoadLessonsAPI, groupsAPI } from "../../api/api"

export const getGroupCategories = createAsyncThunk(
  "groups-categories/getGroupCategories",
  async (_, thunkAPI): Promise<GroupCategoriesType[]> => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.getGroupsCategories()

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Групи завантажено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const createGroupCategory = createAsyncThunk(
  "groups-categories/createGroupCategory",
  async (payload: CreateGroupCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.createGroupCategory(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Категорію створено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const updateGroupCategory = createAsyncThunk(
  "group-categories/updateGroupCategory",
  async (payload: UpdateGroupCategoryPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.updateGroupCategory(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Категорію оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const deleteGroupCategory = createAsyncThunk(
  "group-categories/deleteGroupCategory",
  async (id: number, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.deleteGroupCategory(id)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Категорію видалено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

/* groups */
export const getGroup = createAsyncThunk("group/getGroup", async (id: string, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.getGroup(id)

  toast.promise(promise, {
    // loading: "Завантаження...",
    // success: "Групу завантажено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const createGroup = createAsyncThunk("group/createGroup", async (payload: CreateGroupPayloadType, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.createGroup(payload)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Групу створено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const updateGroup = createAsyncThunk("group/updateGroup", async (payload: UpdateGroupPayloadType, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.updateGroup(payload)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Групу оновлено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const incrementAllGroupsCourse = createAsyncThunk("group/incrementAllGroupsCourse", async (_, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.incrementAllGroupsCourse()

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Переведено всі групи на наступний курс",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const decrementAllGroupsCourse = createAsyncThunk("group/decrementAllGroupsCourse", async (_, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.decrementAllGroupsCourse()

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Переведено всі групи на попередній курc",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const deleteGroup = createAsyncThunk("group/deleteGroup", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.deleteGroup(id)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Групу видалено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const handleGroupVisible = createAsyncThunk("group/handleGroupVisible", async (id: number, thunkAPI) => {
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

  const promise = groupsAPI.handleGroupVisible(id)

  toast.promise(promise, {
    loading: "Завантаження...",
    success: "Групу оновлено",
    error: (error) => {
      thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
      return (error as any)?.response?.data?.message || error.message
    },
  })

  const { data } = await promise
  thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
  return data
})

export const findGroupLoadLessonsByGroupIdAndSemester = createAsyncThunk(
  "group/findGroupLoadLessonsByGroupIdAndSemester",
  async (payload: FindGroupLoadLessonsByGroupIdAndSemesterPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupLoadLessonsAPI.findGroupLoadLessonsByGroupIdAndSemester(payload)

    toast.promise(promise, {
      // loading: "Завантаження...",
      // success: "Завантажено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

/* Specialization */

export const attachSpecialization = createAsyncThunk(
  "group/attachSpecialization",
  async (payload: AttachSpecializationPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupLoadLessonsAPI.attachSpecialization(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Спец. підгрупу оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const createSpecialization = createAsyncThunk(
  "group/createSpecialization",
  async (payload: CreateSpecializationPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.createSpecialization(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Спец. підгрупу створено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const updateSpecialization = createAsyncThunk(
  "group/updateSpecialization",
  async (payload: UpdateSpecializationPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.updateSpecialization(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Спец. підгрупу оновлено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

export const deleteSpecialization = createAsyncThunk(
  "group/deleteSpecialization",
  async (payload: DeleteSpecializationPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupsAPI.deleteSpecialization(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Спец. підгрупу видалено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)

/* Subgroups */
export const createSubgroups = createAsyncThunk(
  "group/createSubgroups",
  async (payload: CreateSubgroupsPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.LOADING))

    const promise = groupLoadLessonsAPI.createSubgroups(payload)

    toast.promise(promise, {
      loading: "Завантаження...",
      success: "Кількість підгруп змінено",
      error: (error) => {
        thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.ERROR))
        return (error as any)?.response?.data?.message || error.message
      },
    })

    const { data } = await promise
    thunkAPI.dispatch(setLoadingStatus(LoadingStatusTypes.SUCCESS))
    return data
  },
)
