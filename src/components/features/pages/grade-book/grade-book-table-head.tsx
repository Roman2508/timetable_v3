import React from "react"
import { useSelector } from "react-redux"

import { customDayjs } from "@/lib/dayjs"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import { GradeBookSummaryTypes, type GradeBookType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableHeadProps {
  gradeBook: GradeBookType | null
  gradeBookLessonDates: { date: string }[]
}

const GradeBookTableHead: React.FC<IGradeBookTableHeadProps> = ({ gradeBook, gradeBookLessonDates }) => {
  const { lessonThemes } = useSelector(gradeBookSelector)

  if (!gradeBook) return

  return (
    <thead>
      <tr>
        <th className="max-w-[200px] sticky left-0 !z-30 p-0 translate-x-[-1px] border-x sticky top-0 z-20 bg-sidebar text-sm">
          ПІБ студента
        </th>

        {Array(gradeBook ? gradeBook.lesson.hours : 0)
          .fill(null)
          .map((_, index) => {
            const dateObj = gradeBookLessonDates[index]

            const lessonTheme = lessonThemes?.find((el) => el.lessonNumber === index + 1)

            return (
              <React.Fragment key={index}>
                <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger>
                      <span style={{ userSelect: "none" }}>
                        <p>{index + 1}</p>
                        <p>{dateObj ? customDayjs(dateObj.date).format("DD.MM.YY") : "-"}</p>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{lessonTheme ? lessonTheme.name : "Тема не внесена"}</TooltipContent>
                  </Tooltip>
                </th>

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "CURRENT_RATE") && (
                  <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                    <p>Поточний</p>
                    <p style={{ whiteSpace: "nowrap" }}>рейтинг</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "ADDITIONAL_RATE") && (
                  <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                    <p>Додатковий</p>
                    <p style={{ whiteSpace: "nowrap" }}>рейтинг</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_TEST") && (
                  <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                    <p>Модульний</p>
                    <p style={{ whiteSpace: "nowrap" }}>контроль</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_AVERAGE") && (
                  <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                    <p>Тематична</p>
                  </th>
                )}

                {gradeBook.summary.find((el) => el.afterLesson === index + 1 && el.type === "MODULE_SUM") && (
                  <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
                    <p>Рейтинг</p>
                    <p style={{ whiteSpace: "nowrap" }}>з модуля</p>
                  </th>
                )}
              </React.Fragment>
            )
          })}

        {gradeBook.summary.find((el) => el.type === GradeBookSummaryTypes.EXAM) && (
          <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
            <p>Екзамен</p>
          </th>
        )}

        {gradeBook.summary.find((el) => el.type === GradeBookSummaryTypes.LESSON_AVERAGE) && (
          <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">Семестрова</th>
        )}

        {gradeBook.summary.find((el) => el.type === GradeBookSummaryTypes.LESSON_SUM) && (
          <>
            <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
              <p>Рейтинг</p>
              <p style={{ whiteSpace: "nowrap" }}>з дисципліни</p>
            </th>

            <th className="border-x sticky top-0 z-20 bg-sidebar min-w-[80px] text-sm">
              <p>ECTS</p>
            </th>
          </>
        )}
      </tr>
    </thead>
  )
}

export default GradeBookTableHead
