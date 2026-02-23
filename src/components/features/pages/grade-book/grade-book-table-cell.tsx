import React, { useCallback, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/common/input"
import type { GradeBookSummaryTypes, GradeType } from "@/store/gradeBook/grade-book-types"

interface IGradeBookTableCellProps {
  gradeId: number
  colIndex: number
  rowIndex: number
  grades: GradeType[]
  summaryType?: null | GradeBookSummaryTypes
  isDefaultCell?: boolean
  showAbsenceCheckbox?: boolean
  // Design props
  isActive?: boolean
  onActivate?: () => void
  // Callbacks
  onSave: (data: { id: number; rating: number; isAbsence: boolean; summaryType: null | GradeBookSummaryTypes; lessonNumber: number }) => void
  onRegisterCellDataGetter?: (getter: (() => { rating: number; isAbsence: boolean }) | null) => void
  onNavigate?: (direction: "up" | "down" | "left" | "right", row: number, col: number) => void
}

const GradeBookTableCell: React.FC<IGradeBookTableCellProps> = ({
  grades,
  gradeId,
  colIndex,
  rowIndex,
  summaryType = null,
  isDefaultCell = false,
  showAbsenceCheckbox = true,
  isActive = false,
  onActivate,
  onSave,
  onRegisterCellDataGetter,
  onNavigate,
}) => {
  const [isCellHovered, setIsCellHovered] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const currentCellData = useMemo(() =>
    grades.find((el) =>
      summaryType
        ? el.lessonNumber === colIndex && el.summaryType === summaryType
        : el.lessonNumber === colIndex + 1 && el.summaryType === summaryType
    ),
    [grades, colIndex, summaryType]
  )

  const initialData = () => ({
    rating: currentCellData?.rating ?? 0,
    isAbsence: currentCellData?.isAbsence ?? false,
    lessonNumber: currentCellData?.lessonNumber ?? (summaryType ? colIndex : colIndex + 1),
  })

  const [localData, setLocalData] = useState(initialData)
  const [backupData, setBackupData] = useState(initialData)
  const localDataRef = useRef(localData)
  localDataRef.current = localData

  const showEditUI = isCellHovered || inputFocused

  const syncFromStore = useCallback(() => {
    const data = {
      rating: currentCellData?.rating ?? 0,
      isAbsence: currentCellData?.isAbsence ?? false,
      lessonNumber: currentCellData?.lessonNumber ?? (summaryType ? colIndex : colIndex + 1),
    }
    setLocalData(data)
    setBackupData(data)
  }, [currentCellData, summaryType, colIndex])

  const saveGrade = useCallback(() => {
    const current = localDataRef.current
    const backup = backupData
    const hasChanged = current.isAbsence !== backup.isAbsence || current.rating !== backup.rating
    if (hasChanged) {
      onSave({
        id: gradeId,
        rating: current.rating,
        isAbsence: current.isAbsence,
        summaryType,
        lessonNumber: current.lessonNumber,
      })
      setBackupData(current)
    }
  }, [backupData, gradeId, summaryType, onSave])

  const saveGradeRef = useRef(saveGrade)
  saveGradeRef.current = saveGrade

  const handleMouseEnter = useCallback(() => {
    setIsCellHovered(true)
    if (!inputFocused) {
      syncFromStore()
    }
  }, [inputFocused, syncFromStore])

  const handleMouseLeave = useCallback(() => {
    setIsCellHovered(false)
    if (!inputFocused) {
      saveGradeRef.current()
    }
  }, [inputFocused])

  const handleInputFocus = useCallback(() => {
    setInputFocused(true)
    syncFromStore()
    onRegisterCellDataGetter?.(() => localDataRef.current)
    onActivate?.()
  }, [onActivate, onRegisterCellDataGetter, syncFromStore])

  const handleInputBlur = useCallback(() => {
    setInputFocused(false)
    saveGradeRef.current()
    onRegisterCellDataGetter?.(null)
  }, [onRegisterCellDataGetter])

  const handleAbsentToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setLocalData((prev) => ({ ...prev, isAbsence: !prev.isAbsence }))
  }, [])

  const displayAbsent = (inputFocused || isCellHovered)
    ? localData.isAbsence
    : currentCellData?.isAbsence

  const displayRating = inputFocused
    ? localData.rating
    : currentCellData?.rating ?? 0

  return (
    <td
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-col={colIndex}
      style={{ position: "relative" }}
      className={cn(
        "border-b border-r border-border text-center cursor-pointer",
        "h-[30px] sm:h-[32px]",
        isDefaultCell ? "" : "bg-sidebar",
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

        <div className="relative w-[40px] h-full flex items-center justify-center">
          <Input
            data-row={rowIndex}
            data-col={colIndex}
            className={cn(
              "p-0 bg-transparent border-0 h-full w-full text-sm rounded-none text-center focus-visible:border-gray-300 focus-visible:ring-0",
              !showEditUI && "opacity-0",
            )}
            value={displayRating !== 0 ? displayRating : ""}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => {
              const isNumber = !isNaN(Number(e.target.value))
              if (!isNumber) return
              setLocalData((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") { saveGradeRef.current(); return }
              if (e.key === "Escape") { setLocalData(backupData); return }
              if (e.key === "ArrowUp") { e.preventDefault(); onNavigate?.("up", rowIndex, colIndex) }
              if (e.key === "ArrowDown") { e.preventDefault(); onNavigate?.("down", rowIndex, colIndex) }
              if (e.key === "ArrowLeft") { e.preventDefault(); onNavigate?.("left", rowIndex, colIndex) }
              if (e.key === "ArrowRight") { e.preventDefault(); onNavigate?.("right", rowIndex, colIndex) }
            }}
          />
          {!showEditUI && (
            <p className="absolute inset-0 flex items-center justify-center text-sm pointer-events-none">
              {currentCellData?.rating ? currentCellData.rating : ""}
            </p>
          )}
        </div>
      </div>
    </td>
  )
}

export default React.memo(GradeBookTableCell)
