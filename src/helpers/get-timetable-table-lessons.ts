import type { GroupLoadType } from "@/store/groups/groups-types"
import { sortLessonsByLessonType } from "./sort-lessons-by-lesson-type"
import { groupAndSortAuditoryLessons } from "./group-and-sort-auditory-lessons"
import type { ScheduleLessonType } from "@/store/schedule-lessons/schedule-lessons-types"
import { findLessonsCountForLessonsTable } from "./find-lessons-count-for-lessons-table"

type GroupLoadT = GroupLoadType[] | null
type ScheduleLessonsT = ScheduleLessonType[] | null
type TimetableT = string | null

const getTimetableTableLessons = (groupLoad: GroupLoadT, scheduleLessons: ScheduleLessonsT, type: TimetableT) => {
  if (type === "auditory") {
    if (!scheduleLessons) return []

    return groupAndSortAuditoryLessons(scheduleLessons)
  }

  if (!groupLoad) return []

  const lessonsWithFact = groupLoad.map((el) => {
    const fact = findLessonsCountForLessonsTable(
      el.name,
      el.group.id,
      el.subgroupNumber,
      el.stream?.id,
      el.typeRu,
      scheduleLessons,
    )

    return { ...el, fact }
  })

  return sortLessonsByLessonType(lessonsWithFact)
}

export { getTimetableTableLessons }
