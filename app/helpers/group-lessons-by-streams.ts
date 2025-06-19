import type { GroupLoadType } from "~/store/groups/groups-types";

export type StreamLessonType = {
  name: string;
  group: { id: number; name: string };
  semester: number;
  lectures: null;
  practical: null;
  laboratory: null;
  seminars: null;
  exams: null;
};

export const groupLessonsByStreams = (lessons: GroupLoadType[]): StreamLessonType[] => {
  const groupedLessons: Record<string, GroupLoadType[]> = {};

  lessons.forEach((subject) => {
    const key1 = subject.name ?? "";
    const key2 = subject.semester ?? "";
    const key3 = subject.group.name ?? "";
    const key4 = subject.subgroupNumber ?? "";

    const key = key1 + key2 + key3 + key4;

    if (!groupedLessons[key]) {
      groupedLessons[key] = [];
    }

    groupedLessons[key].push(subject);
  });

  const groupedLessonsValues = Object.values(groupedLessons) || [];

  const streamLessons = groupedLessonsValues.map((el) => {
    const lesson = {
      name: el[0].name,
      group: el[0].group,
      semester: el[0].semester,
      lectures: null,
      practical: null,
      laboratory: null,
      seminars: null,
      exams: null,
    };

    el.forEach((lessonType) => {
      if (lessonType.typeEn in lesson) {
        // @ts-ignore
        lesson[lessonType.typeEn] = lessonType.hours;
      }
    });

    return lesson;
  });

  return streamLessons;
};
