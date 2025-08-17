import cookie from "cookie"
import { useEffect } from "react"

import { useLoaderData } from "react-router"
import { store, useAppDispatch } from "~/store/store"
import type { Route } from "./+types/timetable"
import TimetablePage from "~/pages/timetable-page"
import { META_TAGS } from "~/constants/site-meta-tags"
import { scheduleLessonsAPI } from "~/api/schedule-lessons-api"
import { setScheduleLessons } from "~/store/schedule-lessons/schedule-lessons-slice"
import { TIMETABLE_ITEM, TIMETABLE_SEMESTER, TIMETABLE_TYPE } from "~/constants/cookies-keys"
import { settingsAPI } from "~/api/settings-api"
import { setSettings } from "~/store/settings/settings-slice"
import { auditoriesAPI } from "~/api/auditories-api"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Редактор розкладу" }, ...META_TAGS]
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const state = store.getState()

  const { data: settings } = await settingsAPI.getSettings()

  const itemId = state.general.timetable.item
  const semester = state.general.timetable.semester
  const type = state.general.timetable.type

  if (itemId && semester && type) {
    const payload = { id: itemId, semester: semester, type: type as "group" | "teacher" | "auditory" }
    const { data: scheduleLessons, status } = await scheduleLessonsAPI.getLessons(payload)

    console.log("status", status, typeof status)

    if (status === 404) {
    }

    return { scheduleLessons, settings }
  }

  return { scheduleLessons: null, settings }
}

export default function Timetable() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setSettings(loaderData.settings))
    dispatch(setScheduleLessons(loaderData.scheduleLessons))
  }, [loaderData])

  return <TimetablePage />
}
