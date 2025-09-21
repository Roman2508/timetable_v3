import { useEffect } from "react"

import { useLoaderData } from "react-router"
import { groupsAPI } from "@/api/groups-api"
import type { Route } from "./+types/timetable"
import { settingsAPI } from "@/api/settings-api"
import { teachersAPI } from "@/api/teachers-api"
import TimetablePage from "@/pages/timetable-page"
import { auditoriesAPI } from "@/api/auditories-api"
import { store, useAppDispatch } from "@/store/store"
import { META_TAGS } from "@/constants/site-meta-tags"
import { setSettings } from "@/store/settings/settings-slice"
import { scheduleLessonsAPI } from "@/api/schedule-lessons-api"
import { setGroupCategories } from "@/store/groups/groups-slice"
import { setTeacherCategories } from "@/store/teachers/teachers-slice"
import { setAuditoryCategories } from "@/store/auditories/auditories-slise"
import { setScheduleLessons } from "@/store/schedule-lessons/schedule-lessons-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Редактор розкладу" }, ...META_TAGS]
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const state = store.getState()

  const { data: settings } = await settingsAPI.getSettings()

  const { data: groupsCategories } = await groupsAPI.getGroupsCategories()
  const { data: teacherCategories } = await teachersAPI.getTeachersCategories()
  const { data: auditoryCategories } = await auditoriesAPI.getAuditoryCategories()

  const itemId = state.general.timetable.item
  const semester = state.general.timetable.semester
  const type = state.general.timetable.type

  if (itemId && semester && type) {
    const payload = { id: itemId, semester: semester, type: type as "group" | "teacher" | "auditory" }
    const { data: scheduleLessons, status } = await scheduleLessonsAPI.getLessons(payload)

    if (status === 404) {
    }

    return { scheduleLessons, settings, groupsCategories, teacherCategories, auditoryCategories }
  }

  return { scheduleLessons: null, settings, groupsCategories, teacherCategories, auditoryCategories }
}

export default function Timetable() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setSettings(loaderData.settings))
    dispatch(setScheduleLessons(loaderData.scheduleLessons))

    dispatch(setGroupCategories(loaderData.groupsCategories))
    dispatch(setTeacherCategories(loaderData.teacherCategories))
    dispatch(setAuditoryCategories(loaderData.auditoryCategories))
  }, [loaderData])

  return <TimetablePage />
}
