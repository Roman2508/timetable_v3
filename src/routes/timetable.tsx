import { useEffect } from "react"
import { useSelector } from "react-redux"

import { useAppDispatch } from "@/store/store"
import TimetablePage from "@/pages/timetable-page"
import { generalSelector } from "@/store/general/general-slice"
import { getSettings } from "@/store/settings/settings-async-actions"
import { getGroupCategories } from "@/store/groups/groups-async-actions"
import { getTeachersCategories } from "@/store/teachers/teachers-async-actions"
import { getAuditoryCategories } from "@/store/auditories/auditories-async-actions"
import { getScheduleLessons } from "@/store/schedule-lessons/schedule-lessons-async-actions"

export default function Timetable() {
  const dispatch = useAppDispatch()

  const { timetable } = useSelector(generalSelector)

  useEffect(() => {
    dispatch(getSettings(1))
    dispatch(getGroupCategories())
    dispatch(getTeachersCategories())
    dispatch(getAuditoryCategories())

    if (timetable.item && timetable.category && timetable.type) {
      const payload = {
        id: timetable.item,
        semester: timetable.semester || 1,
        type: timetable.type as "group" | "teacher" | "auditory",
      }

      dispatch(getScheduleLessons(payload))
    }
  }, [])

  return <TimetablePage />
}
