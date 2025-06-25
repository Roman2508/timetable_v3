import type { GroupLoadType } from "~/store/groups/groups-types";
import { sortLessonsByLessonType } from "./sort-lessons-by-lesson-type";
import { groupAndSortAuditoryLessons } from "./group-and-sort-auditory-lessons";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";

type GroupLoadT = GroupLoadType[] | null;
type ScheduleLessonsT = ScheduleLessonType[] | null;
type TimetableT = string | null;

const getTimetableTableLessons = (groupLoad: GroupLoadT, scheduleLessons: ScheduleLessonsT, type: TimetableT) => {
  if (type === "auditory") {
    if (!scheduleLessons) return [];

    return groupAndSortAuditoryLessons(scheduleLessons);
  }

  if (!groupLoad) return [];
  return sortLessonsByLessonType(groupLoad);
};

export { getTimetableTableLessons };
