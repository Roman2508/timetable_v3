import { useSelector } from "react-redux"
import React, { useMemo, type FC } from "react"

import { useAppDispatch } from "@/store/store"
import GradeBookTableHead from "./grade-book-table-head"
import GradeBookTableCell from "./grade-book-table-cell"
import { gradeBookSummary } from "@/helpers/grade-book-summary"
import { updateGrade } from "@/store/gradeBook/grade-book-async-actions"
import { gradeBookSelector, updateGradesLocally } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookSummaryTypes, GradeType, StudentGradesType } from "@/store/gradeBook/grade-book-types"

const cellInitialState = {
  lessonNumber: 0,
  isAbsence: false,
  rating: 0,
  summaryType: null as null | GradeBookSummaryTypes,
  student: 0,
}

interface IGradeBookTableProps {
  gradeBookLessonDates: { date: string }[]
}

export const GradeBookTable: FC<IGradeBookTableProps> = ({ gradeBookLessonDates }) => {
  const dispatch = useAppDispatch()

  const { gradeBook } = useSelector(gradeBookSelector)

  const [hoveredCell, setHoveredSell] = React.useState({
    col: 0,
    row: 0,
    summaryType: null as null | GradeBookSummaryTypes,
  })
  const [cellData, setCellData] = React.useState<GradeType & { student: number }>(cellInitialState)
  const [backupGrade, setBackupGrade] = React.useState<(GradeType & { student: number }) | null>(null)

  const updageGrade = () => {
    try {
      const isLessonNumberEqual = backupGrade?.lessonNumber === cellData.lessonNumber
      const isAbsenceEqual = backupGrade?.isAbsence === cellData.isAbsence
      const isRatingEqual = backupGrade?.rating === cellData.rating
      const isStudentsEqual = backupGrade?.student === cellData.student

      if (isLessonNumberEqual && isStudentsEqual && (!isAbsenceEqual || !isRatingEqual)) {
        const data = {
          id: cellData.student,
          rating: cellData.rating,
          isAbsence: cellData.isAbsence,
          summaryType: cellData.summaryType,
          lessonNumber: cellData.lessonNumber,
        }
        dispatch(updateGradesLocally(data))
        dispatch(updateGrade(data))
        setBackupGrade(null)
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const gradeBookGrades = useMemo(() => {
    if (!gradeBook) return []
    return JSON.parse(JSON.stringify(gradeBook.grades)).sort((a: StudentGradesType, b: StudentGradesType) => {
      if (a.student.name < b.student.name) return -1
      if (a.student.name > b.student.name) return 1
      return 0
    })
  }, [gradeBook?.grades])

  return (
    <>
      <div className="block max-w-full flex-1">
        <table className="block w-full overflow-auto border h-full max-h-[calc(100vh-140px)] relative rounded-md shadow-sm">
          <GradeBookTableHead gradeBook={gradeBook} gradeBookLessonDates={gradeBookLessonDates} />

          <tbody>
            {gradeBookGrades.map((grade: StudentGradesType, rowIndex: number) => (
              <tr key={grade.id} className="border border-b !h-[30px]">
                <td className="truncate max-w-[300px] border-l sticky left-0 z-10 bg-background translate-x-[-1px] p-0 px-2 border-t text-sm">
                  {rowIndex + 1}. {grade.student.name}
                </td>

                {Array(gradeBook ? gradeBook.lesson.hours : 0)
                  .fill(null)
                  .map((_, colIndex) => {
                    const moduleAvarage = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "MODULE_AVERAGE",
                    )

                    const moduleSum = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "MODULE_SUM",
                    )

                    const moduleTest = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "MODULE_TEST",
                    )

                    const additionalRate = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "ADDITIONAL_RATE",
                    )

                    const currentRate = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "CURRENT_RATE",
                    )

                    const examRate = gradeBook?.summary.find(
                      (el) => el.afterLesson === colIndex + 1 && el.type === "EXAM",
                    )

                    return (
                      <React.Fragment key={colIndex}>
                        <GradeBookTableCell
                          isDefaultCell
                          gradeId={grade.id}
                          colIndex={colIndex}
                          rowIndex={rowIndex}
                          cellData={cellData}
                          grades={grade.grades}
                          setCellData={setCellData}
                          hoveredCell={hoveredCell}
                          updageGrade={updageGrade}
                          backupGrade={backupGrade}
                          setHoveredSell={setHoveredSell}
                          setBackupGrade={setBackupGrade}
                        />

                        {currentRate && (
                          <th className="bg-sidebar border-t text-sm">
                            <p style={{ textAlign: "center", margin: 0 }}>
                              {gradeBookSummary.getModuleRate(
                                gradeBook ? gradeBook.summary : [],
                                grade.grades,
                                currentRate.afterLesson,
                                "current_sum",
                              )}
                            </p>
                          </th>
                        )}

                        {additionalRate && (
                          <GradeBookTableCell
                            gradeId={grade.id}
                            colIndex={colIndex}
                            rowIndex={rowIndex}
                            cellData={cellData}
                            grades={grade.grades}
                            setCellData={setCellData}
                            hoveredCell={hoveredCell}
                            backupGrade={backupGrade}
                            updageGrade={updageGrade}
                            showAbsenceCheckbox={false}
                            setHoveredSell={setHoveredSell}
                            setBackupGrade={setBackupGrade}
                            summaryType={additionalRate.type}
                          />
                        )}

                        {moduleTest && (
                          <GradeBookTableCell
                            gradeId={grade.id}
                            colIndex={colIndex}
                            rowIndex={rowIndex}
                            cellData={cellData}
                            grades={grade.grades}
                            setCellData={setCellData}
                            hoveredCell={hoveredCell}
                            updageGrade={updageGrade}
                            backupGrade={backupGrade}
                            showAbsenceCheckbox={false}
                            summaryType={moduleTest.type}
                            setHoveredSell={setHoveredSell}
                            setBackupGrade={setBackupGrade}
                          />
                        )}

                        {moduleAvarage && (
                          <th className="bg-sidebar border-t text-sm">
                            <p style={{ textAlign: "center", margin: 0 }}>
                              {gradeBookSummary.getModuleRate(
                                gradeBook ? gradeBook.summary : [],
                                grade.grades,
                                moduleAvarage.afterLesson,
                                "average",
                              )}
                            </p>
                          </th>
                        )}

                        {moduleSum && (
                          <th className="bg-sidebar border-t text-sm">
                            <p style={{ textAlign: "center", margin: 0 }}>
                              {gradeBookSummary.getModuleRate(
                                gradeBook ? gradeBook.summary : [],
                                grade.grades,
                                moduleSum.afterLesson,
                                "sum",
                              )}
                            </p>
                          </th>
                        )}

                        {examRate && (
                          <GradeBookTableCell
                            gradeId={grade.id}
                            colIndex={colIndex}
                            rowIndex={rowIndex}
                            cellData={cellData}
                            grades={grade.grades}
                            setCellData={setCellData}
                            hoveredCell={hoveredCell}
                            updageGrade={updageGrade}
                            backupGrade={backupGrade}
                            showAbsenceCheckbox={false}
                            summaryType={examRate.type}
                            setHoveredSell={setHoveredSell}
                            setBackupGrade={setBackupGrade}
                          />
                        )}
                      </React.Fragment>
                    )
                  })}

                {gradeBook?.summary.find((el) => el.type === "LESSON_AVERAGE") && (
                  <td style={{ textAlign: "center", backgroundColor: "#f3f3f3" }}>
                    {gradeBookSummary.getTotalRate(grade.grades, "average")}
                  </td>
                )}

                {gradeBook?.summary.find((el) => el.type === "LESSON_SUM") && (
                  <>
                    <td style={{ textAlign: "center", backgroundColor: "#f3f3f3" }}>
                      {gradeBookSummary.getTotalRate(grade.grades, "sum")}
                    </td>

                    <td style={{ textAlign: "center", backgroundColor: "#f3f3f3" }}>
                      {gradeBookSummary.calcECTS(Number(gradeBookSummary.getTotalRate(grade.grades, "sum")))}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
