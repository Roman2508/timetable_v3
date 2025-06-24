import type { GroupLoadType } from "~/store/groups/groups-types";
import type { StreamLessonType } from "./group-lessons-by-streams";

type LessonKey = "lectures" | "practical" | "laboratory" | "seminars" | "exams";

export const getCombinedStreamLessons = (
  selectedLesson: StreamLessonType | null,
  allLessons: GroupLoadType[] | null,
) => {
  if (!selectedLesson || !allLessons || !allLessons.length) return;

  const keys: LessonKey[] = ["lectures", "practical", "laboratory", "seminars", "exams"];

  const combinedIds = keys
    .map((key) => {
      const lesson = selectedLesson[key];
      if (lesson !== null && lesson.unitedWith.length > 1) {
        return lesson.unitedWith.filter((id) => id !== lesson.id);
      }
    })
    .filter((el) => !!el);

  const combinedLessons = combinedIds.flatMap((idsArray) => {
    return idsArray
      .map((id) => {
        return allLessons.find((el) => el.id === id);
      })
      .filter((el) => !!el);
  });

  const groupedLessonsArray: Record<string, GroupLoadType[]> = {};

  combinedLessons.forEach((l) => {
    const key1 = l.semester || "";
    const key2 = String(l.group.id) || "";
    const key3 = l.subgroupNumber || "";
    const key4 = l.specialization || "";
    const key = key1 + key2 + key3 + key4;

    if (!groupedLessonsArray[key]) {
      groupedLessonsArray[key] = [];
    }
    groupedLessonsArray[key].push(l);
  });

  const groupedLessons = Object.values(groupedLessonsArray) || [];

  return groupedLessons.map((lesson) => {
    const subgroup = lesson[0].subgroupNumber ? `${lesson[0].subgroupNumber}` : "";
    const specialization = lesson[0].specialization ? ` ${lesson[0].specialization}` : "";

    const groupLabel = lesson[0].group.name + subgroup + specialization;

    return {
      name: lesson[0].name,
      group: groupLabel,
      semester: lesson[0].semester,
      lessonTypes: lesson.map((el) => el.typeRu),
    };
  });
};
