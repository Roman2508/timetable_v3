import type { GradeBookSummaryType, GradeType } from "@/store/gradeBook/grade-book-types"

export const gradeBookSummary = {
  getModuleRate(
    summary: GradeBookSummaryType[],
    grades: GradeType[],
    currentRange: number,
    type: "average" | "sum" | "current_sum",
  ): string {
    const summaryCopy: GradeBookSummaryType[] = JSON.parse(JSON.stringify(summary))
    const summartWithoutRateAndTest = summaryCopy.filter(
      (el) => el.type !== "ADDITIONAL_RATE" && el.type !== "MODULE_TEST" && el.type !== "EXAM",
    )
    const sortedSummary = summartWithoutRateAndTest.sort(
      (a: GradeBookSummaryType, b: GradeBookSummaryType) => a.afterLesson - b.afterLesson,
    )
    const indices: number[] = sortedSummary.map((item: GradeBookSummaryType) => item.afterLesson)

    const gradesCopy = JSON.parse(JSON.stringify(grades))
    const sotredGrades: GradeType[] = gradesCopy.sort((a: GradeType, b: GradeType) => a.lessonNumber - b.lessonNumber)
    const parts: GradeType[][] = []

    indices.forEach((_, index: number) => {
      const current = indices[index]
      let prev = indices[index - 1] || 0

      if (current > prev) {
        const grades = sotredGrades.filter((el) => {
          return el.lessonNumber > prev && el.lessonNumber <= current
        })
        parts.push(grades)
        return
      }

      if (current === prev) {
        prev = indices[index - 2] || 0

        const grades = sotredGrades.filter((el) => {
          return el.lessonNumber > prev && el.lessonNumber <= current
        })
        parts.push(grades)
      }
    })

    if (currentRange < 0) return ""

    const selectedPartIndex = sortedSummary.findIndex((el: GradeBookSummaryType) => el.afterLesson === currentRange)

    const selectedPart = parts[selectedPartIndex]

    if (!selectedPart) return ""

    if (type === "average") {
      const notZeroValues = selectedPart.filter((el) => el.rating !== 0)

      const average = notZeroValues.reduce((acc, grade) => acc + grade.rating, 0) / notZeroValues.length
      if (isNaN(average) || average === 0) return "-"
      return average.toFixed(0)
    }

    if (type === "sum") {
      const sum = selectedPart.reduce((acc, grade) => acc + grade.rating, 0)
      if (isNaN(sum) || sum === 0) return "-"
      return String(sum)
    }

    // Рейтинг з модуля без додаткового рейтингу та модульного контролю
    if (type === "current_sum") {
      const selectedPathWithoutSummary = selectedPart.filter((el) => !el.summaryType)
      const sum = selectedPathWithoutSummary.reduce((acc, grade) => acc + grade.rating, 0)
      if (isNaN(sum) || sum === 0) return "-"
      return String(sum)
    }

    return ""
  },

  getTotalRate(grades: GradeType[], type: "average" | "sum") {
    if (type === "average") {
      const notZeroValues = grades.filter((el) => el.rating !== 0)
      const average = notZeroValues.reduce((acc, cur) => cur.rating + acc, 0) / notZeroValues.length
      if (isNaN(average) || average === 0) return "-"
      return average.toFixed(0)
    }

    if (type === "sum") {
      const rate = grades.reduce((acc, cur) => cur.rating + acc, 0)
      if (rate === 0) return "-"
      return rate
    }
  },

  calcECTS(grade: number): "A" | "B" | "C" | "D" | "E" | "FX" | "F" {
    if (grade >= 90) return "A"
    else if (grade >= 82 && grade <= 89) return "B"
    else if (grade >= 74 && grade <= 81) return "C"
    else if (grade >= 64 && grade <= 73) return "D"
    else if (grade >= 60 && grade <= 63) return "E"
    else if (grade >= 35 && grade <= 59) return "FX"
    else return "F"
  },
}
