import type { StudentGradesType } from "@/store/gradeBook/grade-book-types"

export const calcAbsences = (grades: StudentGradesType[]): number => {
  return grades.reduce((t, sg) => t + sg.grades.filter((g) => g.isAbsence).length, 0)
}
