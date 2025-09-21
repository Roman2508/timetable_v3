import type { GroupLoadType } from "@/store/groups/groups-types"

interface IGroupByProps {
  lessonName?: boolean
  semester?: boolean
  groupName?: boolean
  subgroups?: boolean
}

export const groupLessonsByFields = (lessons: GroupLoadType[], groupBy: IGroupByProps): GroupLoadType[][] => {
  const groupedLessons: Record<string, GroupLoadType[]> = {}

  lessons.forEach((subject) => {
    const key1 = groupBy.lessonName ? subject.name : ""
    const key2 = groupBy.semester ? subject.semester : ""
    const key3 = groupBy.groupName ? subject.group.name : ""
    const key4 = groupBy.subgroups ? subject.subgroupNumber : ""

    const key = key1 + key2 + key3 + key4

    if (!groupedLessons[key]) {
      groupedLessons[key] = []
    }

    groupedLessons[key].push(subject)
  })
  return Object.values(groupedLessons) || []
}
