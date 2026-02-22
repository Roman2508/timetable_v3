import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Eraser } from "lucide-react"

export const GradePicker = ({
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
}) => {
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
