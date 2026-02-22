import type { StudentGradesType } from "@/store/gradeBook/grade-book-types"

export const calcAvg = (grades: StudentGradesType[]): string => {
  const all = grades.flatMap((sg) => sg.grades.filter((g) => g.rating > 0).map((g) => g.rating))
  if (all.length === 0) return "—"
  return (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1)
}
