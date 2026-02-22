import { useSelector } from "react-redux"
import React, { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react"
import { X, Eraser } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import GradeBookTableHead from "./grade-book-table-head"
import GradeBookTableCell from "./grade-book-table-cell"
import { gradeBookSummary } from "@/helpers/grade-book-summary"
import { updateGrade } from "@/store/gradeBook/grade-book-async-actions"
import { gradeBookSelector, updateGradesLocally } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookSummaryTypes, GradeType, StudentGradesType } from "@/store/gradeBook/grade-book-types"

/* ───── Row background tokens ───── */
const ROW_EVEN = "bg-card"
const ROW_ODD = "bg-[color:oklch(0.97_0.003_240)]"
const ROW_HOVER = "bg-[color:oklch(0.95_0.01_250)]"

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

/* ───── GradePicker panel (fixed at bottom) ───── */
function GradePicker({
  visible,
  onSelect,
  onClear,
  onClose,
  studentName,
  lessonNum,
}: {
  visible: boolean
  onSelect: (grade: number) => void
  onClear: () => void
  onClose: () => void
  studentName: string | null
  lessonNum: number | null
}) {
  if (!visible) return null

  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none pb-2 px-2 sm:pb-3 sm:px-3">
      <div
        data-grade-picker
        className="pointer-events-auto w-full max-w-md bg-card border border-border rounded-xl shadow-lg shadow-foreground/5"
      >
        {/* Context header */}
        <div className="flex items-center justify-between px-2.5 pt-1.5 pb-0.5 sm:px-3">
          <div className="min-w-0">
            {studentName && lessonNum !== null ? (
              <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                <span className="font-medium text-foreground">{studentName}</span>
                {" / "}
                {"Заняття "}
                {lessonNum}
              </p>
            ) : (
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">{"Оберіть оцінку"}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center size-5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 ml-2"
            aria-label="Закрити"
          >
            <X className="size-3" />
          </button>
        </div>

        {/* Grade buttons — single row */}
        <div className="px-1.5 pb-1.5 sm:px-2 sm:pb-2">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onSelect(g)}
                className={cn(
                  "flex-1 flex items-center justify-center h-7 sm:h-8 rounded-md text-[11px] sm:text-xs font-semibold",
                  "bg-secondary text-secondary-foreground",
                  "hover:bg-primary hover:text-primary-foreground",
                  "active:scale-95 transition-all duration-100 select-none",
                )}
              >
                {g}
              </button>
            ))}
            <button
              type="button"
              onClick={onClear}
              className="flex items-center justify-center size-7 sm:size-8 rounded-md text-muted-foreground bg-secondary/60 hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
              aria-label="Очистити оцінку"
            >
              <Eraser className="size-3 sm:size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const GradeBookTable: FC<IGradeBookTableProps> = ({ gradeBookLessonDates }) => {
  const dispatch = useAppDispatch()

  const { gradeBook } = useSelector(gradeBookSelector)

  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [activeCell, setActiveCell] = useState<{
    row: number
    col: number
    summaryType: null | GradeBookSummaryTypes
  } | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)
  const closingRef = useRef(false)

  const [hoveredCell, setHoveredSell] = React.useState({
    col: 0,
    row: 0,
    summaryType: null as null | GradeBookSummaryTypes,
  })
  const [cellData, setCellData] = React.useState<GradeType & { student: number }>(cellInitialState)
  const [backupGrade, setBackupGrade] = React.useState<(GradeType & { student: number }) | null>(null)
  // Track which cell currently has an input focused — used to block other cells
  // from overwriting the shared cellData while the user is editing.
  const [inputFocusedCell, setInputFocusedCell] = React.useState<{
    row: number
    col: number
    summaryType: null | GradeBookSummaryTypes
  } | null>(null)
  // Always-fresh ref so handlePickerSelect can read the latest cellData without
  // going stale inside its useCallback closure.
  const cellDataRef = useRef(cellData)
  cellDataRef.current = cellData

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
    }
  }

  const handleActivate = useCallback((row: number, col: number, summaryType: null | GradeBookSummaryTypes) => {
    if (closingRef.current) return
    setActiveCell({ row, col, summaryType })
    setPickerVisible(true)
  }, [])

  const handlePickerSelect = useCallback(
    (grade: number) => {
      if (!activeCell || !gradeBook) return
      const gradeBookGradesSorted = [...gradeBook.grades].sort((a: StudentGradesType, b: StudentGradesType) => {
        if (a.student.name < b.student.name) return -1
        if (a.student.name > b.student.name) return 1
        return 0
      })
      const studentGrades = gradeBookGradesSorted[activeCell.row]
      if (!studentGrades) return

      const lessonNumber = activeCell.summaryType ? activeCell.col : activeCell.col + 1

      // Priority: live cellData (covers H toggled while input focused, not yet saved).
      // Fall back to Redux grade for cases where cellData belongs to a different cell.
      const live = cellDataRef.current
      const liveMatchesActive =
        live.student === studentGrades.id &&
        live.lessonNumber === lessonNumber &&
        live.summaryType === activeCell.summaryType

      const existingGrade = studentGrades.grades.find(
        (g) => g.lessonNumber === lessonNumber && g.summaryType === activeCell.summaryType,
      )
      const isAbsence = liveMatchesActive ? live.isAbsence : (existingGrade?.isAbsence ?? false)

      const data = {
        id: studentGrades.id,
        rating: grade,
        isAbsence,
        summaryType: activeCell.summaryType,
        lessonNumber,
      }
      dispatch(updateGradesLocally(data))
      dispatch(updateGrade(data))
      setPickerVisible(false)
      setActiveCell(null)
    },
    [activeCell, gradeBook, dispatch],
  )

  const handlePickerClear = useCallback(() => {
    if (!activeCell || !gradeBook) return
    const gradeBookGradesSorted = [...gradeBook.grades].sort((a: StudentGradesType, b: StudentGradesType) => {
      if (a.student.name < b.student.name) return -1
      if (a.student.name > b.student.name) return 1
      return 0
    })
    const studentGrades = gradeBookGradesSorted[activeCell.row]
    if (!studentGrades) return

    const lessonNumber = activeCell.summaryType ? activeCell.col : activeCell.col + 1
    const live = cellDataRef.current
    const liveMatchesActive =
      live.student === studentGrades.id &&
      live.lessonNumber === lessonNumber &&
      live.summaryType === activeCell.summaryType
    const existingGrade = studentGrades.grades.find(
      (g) => g.lessonNumber === lessonNumber && g.summaryType === activeCell.summaryType,
    )
    const isAbsence = liveMatchesActive ? live.isAbsence : (existingGrade?.isAbsence ?? false)

    const data = {
      id: studentGrades.id,
      rating: 0,
      isAbsence,
      summaryType: activeCell.summaryType,
      lessonNumber,
    }
    dispatch(updateGradesLocally(data))
    dispatch(updateGrade(data))
    setPickerVisible(false)
    setActiveCell(null)
  }, [activeCell, gradeBook, dispatch])

  const handlePickerClose = useCallback(() => {
    setPickerVisible(false)
    setActiveCell(null)
    closingRef.current = true
    setTimeout(() => {
      closingRef.current = false
    }, 100)
  }, [])

  /* Close picker if clicking outside table cells */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (pickerVisible && !target.closest("td") && !target.closest("[data-grade-picker]")) {
        handlePickerClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [pickerVisible, handlePickerClose])

  const gradeBookGrades = useMemo(() => {
    if (!gradeBook) return []
    return JSON.parse(JSON.stringify(gradeBook.grades)).sort((a: StudentGradesType, b: StudentGradesType) => {
      if (a.student.name < b.student.name) return -1
      if (a.student.name > b.student.name) return 1
      return 0
    })
  }, [gradeBook?.grades])

  const activeStudentName =
    activeCell && gradeBookGrades[activeCell.row]
      ? gradeBookGrades[activeCell.row].student.name.split(" ").slice(0, 2).join(" ")
      : null
  const activeLessonNum = activeCell ? activeCell.col + 1 : null

  return (
    <>
      <div
        className={cn("block max-w-full flex-1 overflow-auto", pickerVisible && "pb-14")}
        role="region"
        aria-label="Журнал оцінок"
      >
        <table className="w-max border-collapse text-sm border rounded-md shadow-sm relative max-h-[calc(100vh-140px)]">
          <colgroup>
            <col className="w-[110px] min-[480px]:w-[140px] sm:w-[180px] md:w-[240px]" />
            {Array.from({ length: gradeBook?.lesson.hours ?? 0 }, (_, i) => (
              <col key={i} className="w-[80px]" />
            ))}
          </colgroup>

          <GradeBookTableHead
            gradeBook={gradeBook}
            gradeBookLessonDates={gradeBookLessonDates}
            hoveredCol={hoveredCol}
          />

          <tbody>
            {gradeBookGrades.map((grade: StudentGradesType, rowIndex: number) => {
              const isRowHovered = hoveredRow === rowIndex
              const baseBg = rowIndex % 2 === 0 ? ROW_EVEN : ROW_ODD
              const resolvedBg = isRowHovered ? ROW_HOVER : baseBg

              return (
                <tr
                  key={grade.id}
                  className={cn("transition-colors border-b", resolvedBg)}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Sticky name cell */}
                  <td
                    className={cn(
                      "sticky left-0 z-10 border-b border-r border-border px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 font-medium text-foreground transition-colors",
                      resolvedBg,
                    )}
                    style={{ boxShadow: "2px 0 4px -2px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="flex items-center justify-center size-4 sm:size-[18px] rounded-full bg-muted text-[8px] sm:text-[9px] font-medium text-muted-foreground shrink-0">
                        {rowIndex + 1}
                      </span>
                      <span className="text-[10px] sm:text-[11px] md:text-xs truncate">{grade.student.name}</span>
                    </div>
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
                            rowBg={resolvedBg}
                            isActive={
                              activeCell?.row === rowIndex &&
                              activeCell?.col === colIndex &&
                              activeCell?.summaryType === null
                            }
                            onActivate={() => handleActivate(rowIndex, colIndex, null)}
                            isColHovered={hoveredCol === colIndex}
                            onColEnter={() => setHoveredCol(colIndex)}
                            onColLeave={() => setHoveredCol(null)}
                            isInputFocusedElsewhere={inputFocusedCell !== null}
                            onInputFocus={() =>
                              setInputFocusedCell({ row: rowIndex, col: colIndex, summaryType: null })
                            }
                            onInputBlur={() => setInputFocusedCell(null)}
                          />

                          {currentRate && (
                            <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
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
                              isActive={
                                activeCell?.row === rowIndex &&
                                activeCell?.col === colIndex &&
                                activeCell?.summaryType === additionalRate.type
                              }
                              onActivate={() => handleActivate(rowIndex, colIndex, additionalRate.type)}
                              isInputFocusedElsewhere={inputFocusedCell !== null}
                              onInputFocus={() =>
                                setInputFocusedCell({ row: rowIndex, col: colIndex, summaryType: additionalRate.type })
                              }
                              onInputBlur={() => setInputFocusedCell(null)}
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
                              isActive={
                                activeCell?.row === rowIndex &&
                                activeCell?.col === colIndex &&
                                activeCell?.summaryType === moduleTest.type
                              }
                              onActivate={() => handleActivate(rowIndex, colIndex, moduleTest.type)}
                              isInputFocusedElsewhere={inputFocusedCell !== null}
                              onInputFocus={() =>
                                setInputFocusedCell({ row: rowIndex, col: colIndex, summaryType: moduleTest.type })
                              }
                              onInputBlur={() => setInputFocusedCell(null)}
                            />
                          )}

                          {moduleAvarage && (
                            <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
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
                            <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
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
                              isActive={
                                activeCell?.row === rowIndex &&
                                activeCell?.col === colIndex &&
                                activeCell?.summaryType === examRate.type
                              }
                              onActivate={() => handleActivate(rowIndex, colIndex, examRate.type)}
                              isInputFocusedElsewhere={inputFocusedCell !== null}
                              onInputFocus={() =>
                                setInputFocusedCell({ row: rowIndex, col: colIndex, summaryType: examRate.type })
                              }
                              onInputBlur={() => setInputFocusedCell(null)}
                            />
                          )}
                        </React.Fragment>
                      )
                    })}

                  {gradeBook?.summary.find((el) => el.type === "LESSON_AVERAGE") && (
                    <td
                      className="text-center text-sm min-w-[80px] border-r border-border"
                      style={{ backgroundColor: "#f3f3f3" }}
                    >
                      {gradeBookSummary.getTotalRate(grade.grades, "average")}
                    </td>
                  )}

                  {gradeBook?.summary.find((el) => el.type === "LESSON_SUM") && (
                    <>
                      <td
                        className="text-center text-sm min-w-[80px] border-r border-border"
                        style={{ backgroundColor: "#f3f3f3" }}
                      >
                        {gradeBookSummary.getTotalRate(grade.grades, "sum")}
                      </td>
                      <td
                        className="text-center text-sm min-w-[80px] border-r border-border"
                        style={{ backgroundColor: "#f3f3f3" }}
                      >
                        {gradeBookSummary.calcECTS(Number(gradeBookSummary.getTotalRate(grade.grades, "sum")))}
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Fixed grade picker */}
      <GradePicker
        visible={pickerVisible}
        onSelect={handlePickerSelect}
        onClear={handlePickerClear}
        onClose={handlePickerClose}
        studentName={activeStudentName}
        lessonNum={activeLessonNum}
      />
    </>
  )
}
