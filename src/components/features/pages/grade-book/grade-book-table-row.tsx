import React, { useCallback, useMemo } from "react"

import { cn } from "@/lib/utils"
import GradeBookTableCell from "./grade-book-table-cell"
import { gradeBookSummary } from "@/helpers/grade-book-summary"
import { useAppDispatch } from "@/store/store"
import { updateGrade } from "@/store/gradeBook/grade-book-async-actions"
import { updateGradesLocally } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookSummaryTypes, StudentGradesType, GradeBookSummaryType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableRowProps {
  grade: StudentGradesType
  rowIndex: number
  hours: number
  summary: GradeBookSummaryType[]
  // Only row-relevant slice of activeCell — prevents all rows re-rendering on activeCell change
  activeCellCol: number | undefined
  activeCellSummaryType: null | GradeBookSummaryTypes | undefined
  onActivate: (row: number, col: number, summaryType: null | GradeBookSummaryTypes) => void
  onRegisterCellDataGetter: (
    row: number,
    col: number,
    summaryType: null | GradeBookSummaryTypes,
    getter: (() => { rating: number; isAbsence: boolean }) | null,
  ) => void
  onNavigate: (direction: "up" | "down" | "left" | "right", row: number, col: number) => void
}

const ROW_EVEN = "bg-card"
const ROW_ODD = "bg-[color:oklch(0.97_0.003_240)]"

const GradeBookTableRow: React.FC<IGradeBookTableRowProps> = ({
  grade,
  rowIndex,
  hours,
  summary,
  activeCellCol,
  activeCellSummaryType,
  onActivate,
  onRegisterCellDataGetter,
  onNavigate,
}) => {
  const dispatch = useAppDispatch()
  const baseBg = rowIndex % 2 === 0 ? ROW_EVEN : ROW_ODD

  // O(1) summary lookup instead of O(n) find() per column
  const summaryMap = useMemo(() => {
    const map = new Map<number, Record<string, GradeBookSummaryType>>()
    for (const s of summary) {
      const col = s.afterLesson - 1
      if (!map.has(col)) map.set(col, {})
      map.get(col)![s.type] = s
    }
    return map
  }, [summary])

  const handleSave = useCallback(
    (data: {
      id: number
      rating: number
      isAbsence: boolean
      summaryType: null | GradeBookSummaryTypes
      lessonNumber: number
    }) => {
      dispatch(updateGradesLocally(data))
      dispatch(updateGrade(data))
    },
    [dispatch],
  )

  // Stable callbacks per row — avoid inline arrows in .map() that break React.memo on cells
  const makeOnActivate = useCallback(
    (col: number, st: null | GradeBookSummaryTypes) => () => onActivate(rowIndex, col, st),
    [onActivate, rowIndex],
  )

  const makeOnRegister = useCallback(
    (col: number, st: null | GradeBookSummaryTypes) =>
      (getter: (() => { rating: number; isAbsence: boolean }) | null) =>
        onRegisterCellDataGetter(rowIndex, col, st, getter),
    [onRegisterCellDataGetter, rowIndex],
  )

  return (
    <tr className={cn("grade-book-row border-b", baseBg)}>
      <td
        className={cn(
          "sticky left-0 z-10 border-b border-r border-border px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 font-medium text-foreground",
          baseBg,
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

      {Array(hours)
        .fill(null)
        .map((_, colIndex) => {
          const colSummary = summaryMap.get(colIndex)
          const moduleAvarage = colSummary?.["MODULE_AVERAGE"]
          const moduleSum = colSummary?.["MODULE_SUM"]
          const moduleTest = colSummary?.["MODULE_TEST"]
          const additionalRate = colSummary?.["ADDITIONAL_RATE"]
          const currentRate = colSummary?.["CURRENT_RATE"]
          const examRate = colSummary?.["EXAM"]

          return (
            <React.Fragment key={colIndex}>
              <GradeBookTableCell
                isDefaultCell
                gradeId={grade.id}
                colIndex={colIndex}
                rowIndex={rowIndex}
                grades={grade.grades}
                isActive={activeCellCol === colIndex && activeCellSummaryType === null}
                onActivate={makeOnActivate(colIndex, null)}
                onSave={handleSave}
                onNavigate={onNavigate}
                onRegisterCellDataGetter={makeOnRegister(colIndex, null)}
              />

              {currentRate && (
                <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
                  <p style={{ textAlign: "center", margin: 0 }}>
                    {gradeBookSummary.getModuleRate(summary, grade.grades, currentRate.afterLesson, "current_sum")}
                  </p>
                </th>
              )}

              {additionalRate && (
                <GradeBookTableCell
                  gradeId={grade.id}
                  colIndex={colIndex}
                  rowIndex={rowIndex}
                  grades={grade.grades}
                  showAbsenceCheckbox={false}
                  summaryType={additionalRate.type}
                  isActive={activeCellCol === colIndex && activeCellSummaryType === additionalRate.type}
                  onActivate={makeOnActivate(colIndex, additionalRate.type)}
                  onSave={handleSave}
                  onNavigate={onNavigate}
                  onRegisterCellDataGetter={makeOnRegister(colIndex, additionalRate.type)}
                />
              )}

              {moduleTest && (
                <GradeBookTableCell
                  gradeId={grade.id}
                  colIndex={colIndex}
                  rowIndex={rowIndex}
                  grades={grade.grades}
                  showAbsenceCheckbox={false}
                  summaryType={moduleTest.type}
                  isActive={activeCellCol === colIndex && activeCellSummaryType === moduleTest.type}
                  onActivate={makeOnActivate(colIndex, moduleTest.type)}
                  onSave={handleSave}
                  onNavigate={onNavigate}
                  onRegisterCellDataGetter={makeOnRegister(colIndex, moduleTest.type)}
                />
              )}

              {moduleAvarage && (
                <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
                  <p style={{ textAlign: "center", margin: 0 }}>
                    {gradeBookSummary.getModuleRate(summary, grade.grades, moduleAvarage.afterLesson, "average")}
                  </p>
                </th>
              )}

              {moduleSum && (
                <th className="bg-sidebar border-t border-r border-border text-sm min-w-[80px] text-center font-normal">
                  <p style={{ textAlign: "center", margin: 0 }}>
                    {gradeBookSummary.getModuleRate(summary, grade.grades, moduleSum.afterLesson, "sum")}
                  </p>
                </th>
              )}

              {examRate && (
                <GradeBookTableCell
                  gradeId={grade.id}
                  colIndex={colIndex}
                  rowIndex={rowIndex}
                  grades={grade.grades}
                  showAbsenceCheckbox={false}
                  summaryType={examRate.type}
                  isActive={activeCellCol === colIndex && activeCellSummaryType === examRate.type}
                  onActivate={makeOnActivate(colIndex, examRate.type)}
                  onSave={handleSave}
                  onNavigate={onNavigate}
                  onRegisterCellDataGetter={makeOnRegister(colIndex, examRate.type)}
                />
              )}
            </React.Fragment>
          )
        })}

      {summary.find((el) => el.type === "LESSON_AVERAGE") && (
        <td className="text-center text-sm min-w-[80px] border-r border-border" style={{ backgroundColor: "#f3f3f3" }}>
          {gradeBookSummary.getTotalRate(grade.grades, "average")}
        </td>
      )}

      {summary.find((el) => el.type === "LESSON_SUM") && (
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
}

export default React.memo(GradeBookTableRow)
