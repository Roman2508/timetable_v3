import type { GroupLoadType } from "~/store/groups/groups-types";

type LessonType = {
  id: number;
  hours: number;
  streamName: string | null;
  unitedWith: number[];
};

export type StreamLessonType = {
  name: string;
  group: { id: number; name: string };
  semester: number;
  lectures: LessonType | null;
  practical: LessonType | null;
  laboratory: LessonType | null;
  seminars: LessonType | null;
  exams: LessonType | null;
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
        const lessonDetails = {
          id: lessonType.id,
          hours: lessonType.hours,
          streamName: lessonType.stream ? lessonType.stream.name : null,
          unitedWith: lessonType.unitedWith ? lessonType.unitedWith.map((el) => el.id) : [],
        };
        // @ts-ignore
        lesson[lessonType.typeEn] = lessonDetails;
      }
    });

    return lesson;
  });

  return streamLessons;
};
