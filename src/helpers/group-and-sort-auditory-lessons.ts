import { useMemo } from "react"
import type { GroupLoadType } from "@/store/groups/groups-types"
import type { ScheduleLessonType } from "@/store/schedule-lessons/schedule-lessons-types"

export const groupAndSortAuditoryLessons = (selectedLesson: ScheduleLessonType[]): ScheduleLessonType[] => {
  if (!selectedLesson) return []

  // return useMemo(() => {
  const groupedLessons: Record<string, ScheduleLessonType[]> = {}

  selectedLesson.forEach((subject) => {
    const subjectKey = subject.group.id + subject.name + subject.typeRu + subject.subgroupNumber + subject.stream?.id

    if (!groupedLessons[subjectKey]) {
      groupedLessons[subjectKey] = []
    }

    groupedLessons[subjectKey].push(subject)
  })

  const lessonsArr = Object.values(groupedLessons).flat(2)

  const sortOrder = ["ЛК", "ПЗ", "ЛАБ", "СЕМ", "ЕКЗ", "КОНС", "МЕТОД"]
  const lessonsCopy = JSON.parse(JSON.stringify(lessonsArr))

  lessonsCopy.sort((a: GroupLoadType, b: GroupLoadType) => {
    return sortOrder.indexOf(a.typeRu) - sortOrder.indexOf(b.typeRu)
  })

  return lessonsCopy
  // }, [selectedLesson]);
}
