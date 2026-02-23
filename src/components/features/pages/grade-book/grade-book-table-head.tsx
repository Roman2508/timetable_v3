import React from "react"
import { useSelector } from "react-redux"

import { cn } from "@/lib/utils"
import { customDayjs } from "@/lib/dayjs"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import { GradeBookSummary, type GradeBookType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableHeadProps {
  gradeBook: GradeBookType | null
  gradeBookLessonDates: { date: string }[]
  hoveredCol: number | null
}

const GradeBookTableHead: React.FC<IGradeBookTableHeadProps> = ({ gradeBook, gradeBookLessonDates, hoveredCol }) => {
  const { lessonThemes } = useSelector(gradeBookSelector)

  if (!gradeBook) return

  return (
    <thead>
      <tr className="sticky top-0 z-30">
        {/* Corner cell: sticky top + left */}
        <th
          className="sticky left-0 z-40 border-b-2 border-r border-border px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 text-left font-semibold text-foreground text-[10px] sm:text-xs bg-secondary max-w-[200px]"
          style={{ boxShadow: "2px 0 4px -2px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-normal">{"#"}</span>
            <span>{"ПІБ студента"}</span>
          </div>
        </th>

        {Array(gradeBook ? gradeBook.lesson.hours : 0)
          // {Array(gradeBook.lesson.hours)
          .fill(null)
          .map((_, index) => {
            const dateObj = gradeBookLessonDates[index]
            const lessonTheme = lessonThemes?.find((el) => el.lessonNumber === index + 1)

            return (
              <React.Fragment key={index}>
                <th
                  data-col={index}
                  className={cn(
                    "border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20",
                    hoveredCol === index && "!bg-[color:oklch(0.92_0.015_250)]",
                  )}
                >
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center gap-0.5" style={{ userSelect: "none" }}>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-foreground">{index + 1}</span>
                        {dateObj ? (
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground leading-none">
                            {customDayjs(dateObj.date).format("DD.MM")}
                          </span>
                        ) : (
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground/30 leading-none">{"--"}</span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{lessonTheme ? lessonTheme.name : "Тема не внесена"}</TooltipContent>
                  </Tooltip>
                </th>

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "CURRENT_RATE") && (
                  <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
                    <p>Поточний</p>
                    <p style={{ whiteSpace: "nowrap" }}>рейтинг</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "ADDITIONAL_RATE") && (
                  <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
                    <p>Додатковий</p>
                    <p style={{ whiteSpace: "nowrap" }}>рейтинг</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_TEST") && (
                  <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
                    <p>Модульний</p>
                    <p style={{ whiteSpace: "nowrap" }}>контроль</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_AVERAGE") && (
                  <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
                    <p>Тематична</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_SUM") && (
                  <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
                    <p>Рейтинг</p>
                    <p style={{ whiteSpace: "nowrap" }}>з модуля</p>
                  </th>
                )}
              </React.Fragment>
            )
          })}

        {gradeBook.summary.find((el) => el.type === GradeBookSummary.EXAM) && (
          <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
            <p>Екзамен</p>
          </th>
        )}

        {gradeBook.summary.find((el) => el.type === GradeBookSummary.LESSON_AVERAGE) && (
          <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
            Семестрова
          </th>
        )}

        {gradeBook.summary.find((el) => el.type === GradeBookSummary.LESSON_SUM) && (
          <>
            <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
              <p>Рейтинг</p>
              <p style={{ whiteSpace: "nowrap" }}>з дисципліни</p>
            </th>
            <th className="border-b-2 border-r border-border px-0.5 py-1.5 sm:py-2 text-center font-medium bg-secondary min-w-[80px] sticky top-0 z-20 text-[10px] sm:text-xs">
              <p>ECTS</p>
            </th>
          </>
        )}
      </tr>
    </thead>
  )
}

export default GradeBookTableHead
