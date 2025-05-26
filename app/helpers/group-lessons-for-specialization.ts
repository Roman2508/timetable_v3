import type { GroupLoadType } from "~/store/groups/groups-types";

export type SpecializationLessonsType = {
  name: string;
  semester: number;
  groupId: number;
  specialization: string;
  planSubjectId: number;
  lectures: null | number;
  practical: null | number;
  laboratory: null | number;
  seminars: null | number;
  exams: null | number;
};

/**
 * Групує дисципліни за name+semester
 */
export const groupLessonForSpecialization = (lessons: GroupLoadType[]): SpecializationLessonsType[] => {
  // Створюємо об’єкт для групування предметів за назвою + семестром
  const groupedLessons: Record<string, GroupLoadType[]> = {};

  // Групуємо усі записи по ключу: назва предмета + семестр
  lessons.forEach((subject) => {
    const subjectKey = subject.name + subject.semester;

    if (!groupedLessons[subjectKey]) {
      groupedLessons[subjectKey] = [];
    }

    groupedLessons[subjectKey].push(subject);
  });

  return Object.values(groupedLessons).map((el) => {
    const lesson = {
      name: el[0].name,
      semester: el[0].semester,
      groupId: el[0].group.id,
      specialization: el[0].specialization,
      planSubjectId: el[0].planSubjectId.id,
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
};
