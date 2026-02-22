import { useCallback, useRef, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/common/input"
import type { GradeBookSummaryTypes, GradeType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableCellProps {
  gradeId: number
  colIndex: number
  rowIndex: number
  grades: GradeType[]
  updageGrade: () => void
  isDefaultCell?: boolean
  showAbsenceCheckbox?: boolean
  cellData: GradeType & { student: number }
  summaryType?: null | GradeBookSummaryTypes
  backupGrade: (GradeType & { student: number }) | null
  setCellData: Dispatch<SetStateAction<GradeType & { student: number }>>
  setBackupGrade: Dispatch<SetStateAction<(GradeType & { student: number }) | null>>
  hoveredCell: { col: number; row: number; summaryType: null | GradeBookSummaryTypes }
  setHoveredSell: Dispatch<SetStateAction<{ col: number; row: number; summaryType: null | GradeBookSummaryTypes }>>
  // Design props
  isActive?: boolean
  onActivate?: () => void
  isColHovered?: boolean
  onColEnter?: () => void
  onColLeave?: () => void
  rowBg?: string
  // Input focus coordination props (prevent data leak between cells)
  isInputFocusedElsewhere?: boolean
  onInputFocus?: () => void
  onInputBlur?: () => void
}

const GradeBookTableCell: React.FC<IGradeBookTableCellProps> = ({
  grades,
  gradeId,
  colIndex,
  rowIndex,
  cellData,
  setCellData,
  hoveredCell,
  updageGrade,
  backupGrade,
  setHoveredSell,
  setBackupGrade,
  summaryType = null,
  isDefaultCell = false,
  showAbsenceCheckbox = true,
  isActive = false,
  onActivate,
  isColHovered = false,
  onColEnter,
  onColLeave,
  rowBg = "",
  isInputFocusedElsewhere = false,
  onInputFocus,
  onInputBlur,
}) => {
  const [isCellHovered, setIsCellHovered] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  // Always up-to-date ref so blur handler can call the latest updageGrade
  const updageGradeRef = useRef(updageGrade)
  updageGradeRef.current = updageGrade

  const currentCellData = grades.find((el) => {
    if (summaryType) {
      return el.lessonNumber === colIndex && el.summaryType === summaryType
    }
    return el.lessonNumber === colIndex + 1 && el.summaryType === summaryType
  })

  const isHoveredCell =
    hoveredCell.col === colIndex && hoveredCell.row === rowIndex && hoveredCell.summaryType === summaryType

  // The input and H button are shown when:
  //  - mouse is over this cell, OR
  //  - this cell's input currently has focus
  const showEditUI = isHoveredCell || inputFocused

  const onHoverCell = () => {
    setHoveredSell({ col: colIndex, row: rowIndex, summaryType })
    if (currentCellData) {
      const data = {
        summaryType,
        student: gradeId,
        rating: currentCellData.rating,
        isAbsence: currentCellData.isAbsence,
        lessonNumber: currentCellData.lessonNumber,
      }
      setCellData(data)
      setBackupGrade(data)
    } else {
      const data = {
        rating: 0,
        summaryType,
        student: gradeId,
        isAbsence: false,
        lessonNumber: summaryType ? colIndex : colIndex + 1,
      }
      setCellData(data)
      setBackupGrade(data)
    }
  }

  const handleMouseEnter = useCallback(() => {
    setIsCellHovered(true)
    // When another cell's input is focused, skip updating the shared cellData/hoveredCell.
    // This prevents the focused cell from reading another cell's grade/isAbsence.
    if (!isInputFocusedElsewhere) {
      onHoverCell()
      onColEnter?.()
    }
  }, [onColEnter, colIndex, rowIndex, isInputFocusedElsewhere])

  const handleMouseLeave = useCallback(() => {
    setIsCellHovered(false)
    // Do NOT save on mouseLeave if input is focused — save happens on blur instead.
    if (!inputFocused) {
      updageGradeRef.current()
    }
    onColLeave?.()
  }, [onColLeave, inputFocused])

  const handleInputFocus = useCallback(() => {
    setInputFocused(true)
    onInputFocus?.()
    onActivate?.()
  }, [onActivate, onInputFocus])

  const handleInputBlur = useCallback(() => {
    setInputFocused(false)
    // Parent clears inputFocusedCell; we save here to guarantee 100% sync
    // even if mouse already left before blur.
    updageGradeRef.current()
    onInputBlur?.()
  }, [onInputBlur])

  const handleAbsentToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCellData((prev) => ({ ...prev, isAbsence: !prev.isAbsence }))
    },
    [setCellData],
  )

  // Read isAbsence / rating from live cellData while in edit mode
  // (so H-button flips immediately; input shows what user typed).
  // Read from currentCellData (stable store snapshot) while not editing.
  const displayAbsent = showEditUI ? cellData.isAbsence : currentCellData?.isAbsence

  return (
    <td
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter") updageGradeRef.current()
        if (e.key === "Escape") backupGrade && setCellData(backupGrade)
      }}
      style={{ position: "relative" }}
      className={cn(
        "border-b border-r border-border text-center cursor-pointer",
        "h-[30px] sm:h-[32px]",
        isDefaultCell ? "" : "bg-sidebar",
        isColHovered && !isCellHovered && "!bg-primary/[0.03]",
        isCellHovered && "!bg-primary/[0.06]",
        isActive && "ring-2 ring-inset ring-primary/40",
        !isDefaultCell && "min-w-[80px]",
      )}
    >
      <div
        className={cn(
          "flex items-center h-full px-0.5",
          showAbsenceCheckbox ? "justify-center gap-1" : "justify-center",
        )}
      >
        {/* Absent toggle (H) — visible when cell is in edit mode or absence is active */}
        {showAbsenceCheckbox && (
          <button
            type="button"
            onClick={handleAbsentToggle}
            aria-label={displayAbsent ? "Зняти пропуск" : "Поставити пропуск"}
            aria-pressed={!!displayAbsent}
            className={cn(
              "relative z-[1] flex items-center justify-center w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] shrink-0 rounded text-[7px] sm:text-[8px] font-bold leading-none",
              "transition-all duration-100 select-none cursor-pointer",
              displayAbsent
                ? "bg-destructive/15 text-destructive border border-destructive/30"
                : showEditUI
                  ? "bg-muted text-muted-foreground/40 border border-transparent hover:border-destructive/30 hover:text-destructive/60"
                  : "opacity-0 pointer-events-none",
            )}
          >
            {"H"}
          </button>
        )}

        {/* Grade area: Input when in edit mode, plain text otherwise.
            Input stays mounted even when mouse leaves if it has focus. */}
        {showEditUI ? (
          <Input
            className="p-0 bg-transparent border-0 h-full w-[40px] text-sm rounded-none text-center focus-visible:border-gray-300 focus-visible:ring-0"
            value={cellData.rating !== 0 ? cellData.rating : ""}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => {
              const isNumber = !isNaN(Number(e.target.value))
              if (!isNumber) return
              setCellData((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="w-[40px] text-center text-sm">{currentCellData?.rating ? currentCellData.rating : ""}</p>
        )}
      </div>
    </td>
  )
}

export default GradeBookTableCell
