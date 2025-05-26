import type { GroupLoadType } from "~/store/groups/groups-types";

export type SubgroupsLessonsType = {
  name: string;
  semester: number;
  groupId: number;
  planSubjectId: number;
  lectures: null | number;
  practical: null | number;
  laboratory: null | number;
  seminars: null | number;
  exams: null | number;
};

/**
 * Групує дисципліни за name+semester, потім всередині кожної групи залишає записи з найбільшим номером підгрупи (subgroupNumber)
 */
export const groupLessonByNameSubgroupsAndSemester = (lessons: GroupLoadType[]): SubgroupsLessonsType[] => {
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

  // Перетворюємо об’єкт груп у масив
  const lessonsArr = Object.values(groupedLessons);

  // Обробляємо кожну групу окремо
  const filteredLessons = lessonsArr.map((group) => {
    // Групуємо за унікальною комбінацією: назва предмета + тип занять
    const uniqueValues: Record<string, GroupLoadType[]> = {};

    group.forEach((el) => {
      const subjectAlias = el.name + el.typeEn;

      if (!uniqueValues[subjectAlias]) {
        uniqueValues[subjectAlias] = [];
      }

      uniqueValues[subjectAlias].push(el);
    });

    // Для кожної унікальної комбінації обираємо лише ті елементи, які мають максимальний номер підгрупи
    const filtred = Object.values(uniqueValues).map((el) => {
      const maxSubgroupNumber = Math.max(...el.map((subject) => subject.subgroupNumber));

      // Відкидаємо ті, що мають менший номер підгрупи
      return el.filter((f) => {
        if (f.subgroupNumber < maxSubgroupNumber) {
          return false;
        } else {
          return true;
        }
      });
    });

    // Повертаємо всі елементи з усіх унікальних груп в одній групі
    return filtred.flatMap((array) => array);
  });

  return filteredLessons.map((el) => {
    const lesson = {
      name: el[0].name,
      semester: el[0].semester,
      groupId: el[0].group.id,
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
        lesson[lessonType.typeEn] = lessonType.subgroupNumber;
      }
    });

    return lesson;
  });
};
