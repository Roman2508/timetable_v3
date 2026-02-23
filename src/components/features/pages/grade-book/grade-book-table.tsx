import { useSelector } from "react-redux"
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react"

import { cn } from "@/lib/utils"
import { GradePicker } from "./grade-picker"
import { useAppDispatch } from "@/store/store"
import GradeBookTableRow from "./grade-book-table-row"
import GradeBookTableHead from "./grade-book-table-head"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { updateGrade } from "@/store/gradeBook/grade-book-async-actions"
import { updateGradesLocally } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookSummaryTypes, StudentGradesType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableProps {
  gradeBookLessonDates: { date: string }[]
}

export const GradeBookTable: FC<IGradeBookTableProps> = ({ gradeBookLessonDates }) => {
  const dispatch = useAppDispatch()
  const { gradeBook } = useSelector(gradeBookSelector)

  const [activeCell, setActiveCell] = useState<{
    row: number
    col: number
    summaryType: null | GradeBookSummaryTypes
  } | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)
  const closingRef = useRef(false)

  const cellDataGetterRef = useRef<(() => { rating: number; isAbsence: boolean }) | null>(null)

  const handleRegisterCellDataGetter = useCallback(
    (
      _row: number,
      _col: number,
      _summaryType: null | GradeBookSummaryTypes,
      getter: (() => { rating: number; isAbsence: boolean }) | null,
    ) => {
      cellDataGetterRef.current = getter
    },
    [],
  )

  const handleActivate = useCallback((row: number, col: number, summaryType: null | GradeBookSummaryTypes) => {
    if (closingRef.current) return
    setActiveCell({ row, col, summaryType })
    setPickerVisible(true)
  }, [])

  const gradeBookGrades = useMemo(() => {
    if (!gradeBook) return []
    return [...gradeBook.grades].sort((a: StudentGradesType, b: StudentGradesType) =>
      a.student.name.localeCompare(b.student.name),
    )
  }, [gradeBook?.grades])

  const handlePickerSelect = useCallback(
    (grade: number) => {
      if (!activeCell || !gradeBook) return
      const studentGrades = gradeBookGrades[activeCell.row]
      if (!studentGrades) return

      const lessonNumber = activeCell.summaryType ? activeCell.col : activeCell.col + 1
      const liveData = cellDataGetterRef.current?.()
      const existingGrade = studentGrades.grades.find(
        (g) => g.lessonNumber === lessonNumber && g.summaryType === activeCell.summaryType,
      )
      const isAbsence = liveData?.isAbsence ?? existingGrade?.isAbsence ?? false

      const data = { id: studentGrades.id, rating: grade, isAbsence, summaryType: activeCell.summaryType, lessonNumber }
      dispatch(updateGradesLocally(data))
      dispatch(updateGrade(data))
      setPickerVisible(false)
      setActiveCell(null)
    },
    [activeCell, gradeBook, gradeBookGrades, dispatch],
  )

  const handlePickerClear = useCallback(() => {
    if (!activeCell || !gradeBook) return
    const studentGrades = gradeBookGrades[activeCell.row]
    if (!studentGrades) return

    const lessonNumber = activeCell.summaryType ? activeCell.col : activeCell.col + 1
    const liveData = cellDataGetterRef.current?.()
    const existingGrade = studentGrades.grades.find(
      (g) => g.lessonNumber === lessonNumber && g.summaryType === activeCell.summaryType,
    )
    const isAbsence = liveData?.isAbsence ?? existingGrade?.isAbsence ?? false

    const data = { id: studentGrades.id, rating: 0, isAbsence, summaryType: activeCell.summaryType, lessonNumber }
    dispatch(updateGradesLocally(data))
    dispatch(updateGrade(data))
    setPickerVisible(false)
    setActiveCell(null)
  }, [activeCell, gradeBook, gradeBookGrades, dispatch])

  const handlePickerClose = useCallback(() => {
    setPickerVisible(false)
    setActiveCell(null)
    closingRef.current = true
    setTimeout(() => {
      closingRef.current = false
    }, 100)
  }, [])

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

  // Arrow key navigation — pure DOM, zero re-renders
  const tableRef = useRef<HTMLTableElement>(null)

  const handleNavigate = useCallback((direction: "up" | "down" | "left" | "right", row: number, col: number) => {
    const table = tableRef.current
    if (!table) return

    const inputs = Array.from(table.querySelectorAll<HTMLInputElement>("input[data-row][data-col]")).map((el) => ({
      el,
      row: Number(el.dataset.row),
      col: Number(el.dataset.col),
    }))

    let target: HTMLInputElement | undefined

    if (direction === "up" || direction === "down") {
      const delta = direction === "up" ? -1 : 1
      target = inputs.find((i) => i.col === col && i.row === row + delta)?.el
    } else {
      const sorted = inputs.sort((a, b) => a.row - b.row || a.col - b.col)
      const currentIdx = sorted.findIndex((i) => i.row === row && i.col === col)
      if (currentIdx === -1) return
      target = sorted[direction === "right" ? currentIdx + 1 : currentIdx - 1]?.el
    }

    if (target) {
      target.focus()
      target.select()
    }
  }, [])

  // Column highlight — pure DOM, zero React re-renders
  useEffect(() => {
    const table = tableRef.current
    if (!table) return

    let currentCol: string | null = null

    function onEnter(e: MouseEvent) {
      const cell = (e.target as HTMLElement).closest("td[data-col], th[data-col]") as HTMLElement | null
      const col = cell?.dataset.col ?? null
      if (col === currentCol) return
      currentCol = col
      table!.querySelectorAll("[data-col-highlighted]").forEach((el) => {
        ;(el as HTMLElement).removeAttribute("data-col-highlighted")
      })
      if (col !== null) {
        table!.querySelectorAll(`[data-col="${col}"]`).forEach((el) => {
          ;(el as HTMLElement).setAttribute("data-col-highlighted", "")
        })
      }
    }

    function onLeave(e: MouseEvent) {
      const related = e.relatedTarget as HTMLElement | null
      if (!related || !table!.contains(related)) {
        table!.querySelectorAll("[data-col-highlighted]").forEach((el) => {
          ;(el as HTMLElement).removeAttribute("data-col-highlighted")
        })
        currentCol = null
      }
    }

    table.addEventListener("mouseover", onEnter)
    table.addEventListener("mouseleave", onLeave)
    return () => {
      table.removeEventListener("mouseover", onEnter)
      table.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const activeStudentName =
    activeCell && gradeBookGrades[activeCell.row]
      ? gradeBookGrades[activeCell.row].student.name.split(" ").slice(0, 2).join(" ")
      : null
  const activeLessonNum = activeCell ? activeCell.col + 1 : null

  return (
    <>
      <GradePicker
        visible={pickerVisible}
        onSelect={handlePickerSelect}
        onClear={handlePickerClear}
        onClose={handlePickerClose}
        studentName={activeStudentName}
        lessonNum={activeLessonNum}
      />

      <div
        className={cn("block max-w-full flex-1 overflow-auto", pickerVisible && "pb-14")}
        role="region"
        aria-label="Журнал оцінок"
      >
        <table
          ref={tableRef}
          className="w-max border-collapse text-sm border rounded-md shadow-sm relative max-h-[calc(100vh-140px)]"
        >
          <colgroup>
            <col className="w-[110px] min-[480px]:w-[140px] sm:w-[180px] md:w-[240px]" />
            {Array.from({ length: gradeBook?.lesson.hours ?? 0 }, (_, i) => (
              <col key={i} className="w-[80px]" />
            ))}
          </colgroup>

          <GradeBookTableHead gradeBook={gradeBook} gradeBookLessonDates={gradeBookLessonDates} hoveredCol={null} />

          <tbody>
            {gradeBookGrades.map((grade: StudentGradesType, rowIndex: number) => (
              <GradeBookTableRow
                key={grade.id}
                grade={grade}
                rowIndex={rowIndex}
                hours={gradeBook?.lesson.hours ?? 0}
                summary={gradeBook?.summary ?? []}
                // Pass only row-specific slice — unaffected rows won't re-render
                activeCellCol={activeCell?.row === rowIndex ? activeCell.col : undefined}
                activeCellSummaryType={activeCell?.row === rowIndex ? activeCell.summaryType : undefined}
                onActivate={handleActivate}
                onRegisterCellDataGetter={handleRegisterCellDataGetter}
                onNavigate={handleNavigate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
