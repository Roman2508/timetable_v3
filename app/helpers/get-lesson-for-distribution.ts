import type { GroupLoadType } from "~/store/groups/groups-types";

export type DistributionLessonType = {
  name: string;
  semester: number;
  lessonTypes: GroupLoadType[];
};

export const groupLessonsforDistribution = (lessons: GroupLoadType[] | null): DistributionLessonType[] => {
  if (!lessons) return [];

  const groupedLessons: Record<string, GroupLoadType[]> = {};

  lessons.forEach((subject) => {
    const key = subject.name + subject.semester;

    if (!groupedLessons[key]) {
      groupedLessons[key] = [];
    }

    groupedLessons[key].push(subject);
  });

  const lessonTypes = Object.values(groupedLessons) || [];

  return lessonTypes.map((el) => ({
    name: el[0].name,
    semester: el[0].semester,
    lessonTypes: el,
  }));
};
