import type { StudentGradesType } from "@/store/gradeBook/grade-book-types"

// Мінімальний позитивний бал для оцінювання (треба в подальшому змінити на справжній)
const THRESHOLD = 7

export const calcYapu = (grades: StudentGradesType[]): string => {
  const n = grades.length
  if (n === 0) return "—"
  const avgs = grades.map((sg) => {
    const pos = sg.grades.filter((g) => g.rating > 0)
    return pos.length > 0 ? pos.reduce((s, g) => s + g.rating, 0) / pos.length : 0
  })
  return `${Math.round((avgs.filter((g) => g >= THRESHOLD).length / n) * 100)}%`
}
