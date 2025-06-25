import { useMemo } from "react";
import type { GroupLoadType } from "~/store/groups/groups-types";

export const sortLessonsByLessonType = (lessons?: GroupLoadType[]): GroupLoadType[] => {
  if (!lessons) return [];

  // return useMemo(() => {
  const sortOrder = ["ЛК", "ПЗ", "ЛАБ", "СЕМ", "ЕКЗ", "КОНС", "МЕТОД"];
  const lessonsCopy = JSON.parse(JSON.stringify(lessons));

  return lessonsCopy.sort((a: GroupLoadType, b: GroupLoadType) => {
    return sortOrder.indexOf(a.typeRu) - sortOrder.indexOf(b.typeRu);
  });
  // }, [lessons]);
};
