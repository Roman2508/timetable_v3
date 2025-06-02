import type { PlanSubjectType } from "~/store/plans/plans-types";

export type SemesterHoursType = {
  id: number;
  name: string;
  cmk: { id: number; name: string };
  totalHours: number;
  semesterNumber: number;
  lectures: number;
  practical: number;
  laboratory: number;
  seminars: number;
  exams: number;
  examsConsulation: number;
  metodologicalGuidance: number;
  independentWork: number;
};

export type PlanItemType = {
  name: string;
  cmk: { id: number; name: string };
  totalHours: number;
  semesterNumber: number;
  semester_1: SemesterHoursType | null;
  semester_2: SemesterHoursType | null;
  semester_3: SemesterHoursType | null;
  semester_4: SemesterHoursType | null;
  semester_5: SemesterHoursType | null;
  semester_6: SemesterHoursType | null;
  semester_7: SemesterHoursType | null;
  semester_8: SemesterHoursType | null;
};

const getSemesterHours = (lessonItems: PlanSubjectType[], semester: number) => {
  const semesterLessons = lessonItems.find((el) => el.semesterNumber === semester);

  if (semesterLessons) {
    return {
      id: semesterLessons.id,
      name: semesterLessons.name,
      cmk: semesterLessons.cmk,
      totalHours: semesterLessons.totalHours,
      semesterNumber: semesterLessons.semesterNumber,
      lectures: semesterLessons.lectures,
      practical: semesterLessons.practical,
      laboratory: semesterLessons.laboratory,
      seminars: semesterLessons.seminars,
      exams: semesterLessons.exams,
      examsConsulation: semesterLessons.examsConsulation,
      metodologicalGuidance: semesterLessons.metodologicalGuidance,
      independentWork: semesterLessons.independentWork,
    };
  }

  return null;
};

export const groupLessonsByName = (subjects: PlanSubjectType[]): PlanItemType[] => {
  const groupedSubjects: Record<string, any> = {};

  subjects.forEach((subject) => {
    const subjectName = subject.name;

    if (!groupedSubjects[subjectName]) {
      groupedSubjects[subjectName] = [];
    }

    groupedSubjects[subjectName].push(subject);
  });

  const groupedSubjectsValues: PlanSubjectType[][] = Object.values(groupedSubjects);

  const planItems = groupedSubjectsValues.map((el: PlanSubjectType[]) => ({
    name: el[0].name,
    cmk: el[0].cmk,
    totalHours: el[0].totalHours,
    semesterNumber: el[0].semesterNumber,
    semester_1: getSemesterHours(el, 1),
    semester_2: getSemesterHours(el, 2),
    semester_3: getSemesterHours(el, 3),
    semester_4: getSemesterHours(el, 4),
    semester_5: getSemesterHours(el, 5),
    semester_6: getSemesterHours(el, 6),
    semester_7: getSemesterHours(el, 7),
    semester_8: getSemesterHours(el, 8),
  }));

  return planItems;
};
