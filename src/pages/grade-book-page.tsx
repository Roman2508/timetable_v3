import {
  Users,
  Printer,
  BookOpen,
  BarChart3,
  ListFilter,
  TrendingUp,
  NotebookPen,
  ChevronDown,
  GraduationCap,
  AlertTriangle,
  UnfoldVertical,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { Button } from "@/components/ui/common/button"
import { LoadingStatusTypes } from "@/store/app-types"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { WideContainer } from "@/components/layouts/wide-container"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { getGroupCategories } from "@/store/groups/groups-async-actions"
import type { StudentGradesType } from "@/store/gradeBook/grade-book-types"
import { GradeBookTable } from "@/components/features/pages/grade-book/grade-book-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"
import SelectGradeBookModal from "@/components/features/pages/grade-book/select-grade-book-modal"
import GradeBookSummaryModal from "@/components/features/pages/grade-book/grade-book-summary-modal"

/* ───── Stat helpers ───── */
function calcApu(grades: StudentGradesType[]): string {
  const THRESHOLD = 5
  const n = grades.length
  if (n === 0) return "—"
  const avgs = grades.map((sg) => {
    const pos = sg.grades.filter((g) => g.rating > 0)
    return pos.length > 0 ? pos.reduce((s, g) => s + g.rating, 0) / pos.length : 0
  })
  return `${Math.round((avgs.filter((g) => g >= THRESHOLD).length / n) * 100)}%`
}

function calcYapu(grades: StudentGradesType[]): string {
  const THRESHOLD = 7
  const n = grades.length
  if (n === 0) return "—"
  const avgs = grades.map((sg) => {
    const pos = sg.grades.filter((g) => g.rating > 0)
    return pos.length > 0 ? pos.reduce((s, g) => s + g.rating, 0) / pos.length : 0
  })
  return `${Math.round((avgs.filter((g) => g >= THRESHOLD).length / n) * 100)}%`
}

function calcAbsences(grades: StudentGradesType[]): number {
  return grades.reduce((t, sg) => t + sg.grades.filter((g) => g.isAbsence).length, 0)
}

function calcAvg(grades: StudentGradesType[]): string {
  const all = grades.flatMap((sg) => sg.grades.filter((g) => g.rating > 0).map((g) => g.rating))
  if (all.length === 0) return "—"
  return (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1)
}

/* ───── InfoChip ───── */
function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center size-7 rounded-md bg-primary/8 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none">{label}</p>
        <p className="text-sm font-medium text-card-foreground truncate max-w-[200px]">{value}</p>
      </div>
    </div>
  )
}

/* ───── ActionButtons ─────
   Reusable button strip used in both desktop and mobile InfoBar. */
type StatItem = {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

function ActionButtons({
  gradeBook,
  stats,
  onFilter,
  onSummary,
}: {
  gradeBook: boolean
  stats: StatItem[]
  onFilter: () => void
  onSummary: () => void
}) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onFilter}
          >
            <ListFilter className="size-4" />
            <span className="sr-only">Знайти журнал</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Знайти електронний журнал</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onSummary}
          >
            <UnfoldVertical className="rotate-[90deg] size-4" />
            <span className="sr-only">Підсумки</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Додати підсумок</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
            <NotebookPen className="size-4" />
            <span className="sr-only">Теми</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Теми</TooltipContent>
      </Tooltip>

      {/* Statistics popover */}
      <Popover>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 text-muted-foreground hover:text-foreground",
                  !gradeBook && "opacity-40 pointer-events-none",
                )}
              >
                <BarChart3 className="size-4" />
                <span className="sr-only">Статистика</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Статистика</TooltipContent>
        </Tooltip>

        <PopoverContent align="end" className="w-72 p-3">
          <p className="text-xs font-semibold text-foreground mb-2.5">Статистика журналу</p>
          <p className="text-[10px] text-muted-foreground mb-2">
            {"АПУ/ЯПУ розраховані за 12-бальною системою (буде пов'язано з системою оцінювання)"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
                <div className={`flex items-center justify-center size-8 rounded-md ${stat.color}`}>
                  <stat.icon className="size-4" />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-foreground leading-none">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
            <Printer className="size-4" />
            <span className="sr-only">Друк</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Друк</TooltipContent>
      </Tooltip>
    </div>
  )
}

/* ───── Page ───── */
export default function GradeBookPage() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { gradeBook, loadingStatus } = useSelector(gradeBookSelector)

  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const [isOpenSummaryModal, setIsOpenSummaryModal] = useState(false)
  const [gradeBookLessonDates, setGradeBookLessonDates] = useState<{ date: string }[]>([])
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false)

  useEffect(() => {
    dispatch(getGroupCategories())
  }, [])

  const stats = useMemo<StatItem[]>(() => {
    const g = gradeBook?.grades ?? []
    return [
      { label: "Студентів", value: String(g.length), icon: Users, color: "text-primary bg-primary/8" },
      { label: "Середній бал", value: calcAvg(g), icon: TrendingUp, color: "text-emerald-600 bg-emerald-500/10" },
      { label: "АПУ", value: calcApu(g), icon: BarChart3, color: "text-amber-600 bg-amber-500/10" },
      { label: "ЯПУ", value: calcYapu(g), icon: BarChart3, color: "text-violet-600 bg-violet-500/10" },
      {
        label: "Пропусків",
        value: String(calcAbsences(g)),
        icon: AlertTriangle,
        color: "text-destructive bg-destructive/8",
      },
    ]
  }, [gradeBook?.grades])

  return (
    <>
      <SelectGradeBookModal
        open={isOpenFilterModal}
        setOpen={setIsOpenFilterModal}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setGradeBookLessonDates={setGradeBookLessonDates}
      />
      <GradeBookSummaryModal open={isOpenSummaryModal} setOpen={setIsOpenSummaryModal} />

      <WideContainer classNames="h-full flex flex-col">
        {/* ── InfoBar ── */}
        <div className="shrink-0 border-b border-border bg-card mb-4 -mx-[20px]">
          {/* Desktop (md+) */}
          <div className="hidden md:flex items-center justify-between px-6 py-2.5">
            <div className="flex items-center gap-3">
              {gradeBook ? (
                <>
                  <InfoChip
                    icon={<BookOpen className="size-3.5" />}
                    label="Дисципліна"
                    value={`${gradeBook.lesson.name}, ${gradeBook.lesson.semester} сем.`}
                  />
                  <div className="h-5 w-px bg-border" />
                  <InfoChip icon={<Users className="size-3.5" />} label="Група" value={gradeBook.group.name} />
                  <div className="h-5 w-px bg-border" />
                  <InfoChip
                    icon={<GraduationCap className="size-3.5" />}
                    label="Викладач"
                    value={getTeacherFullname(gradeBook.lesson.teacher, "short")}
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Оберіть параметри для пошуку журналу</p>
              )}
            </div>

            <ActionButtons
              gradeBook={!!gradeBook}
              stats={stats}
              onFilter={() => setIsOpenFilterModal(true)}
              onSummary={() => setIsOpenSummaryModal(true)}
            />
          </div>

          {/* Mobile (<md) */}
          <div className="md:hidden">
            {/* Collapsed row */}
            <div className="flex items-center justify-between px-3 py-2">
              <button
                type="button"
                onClick={() => setMobileInfoOpen((v) => !v)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
              >
                <div className="flex items-center justify-center size-6 rounded-md bg-primary/8 text-primary shrink-0">
                  <BookOpen className="size-3" />
                </div>
                {gradeBook ? (
                  <>
                    <span className="text-xs font-medium text-foreground truncate">{gradeBook.lesson.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{gradeBook.group.name}</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Оберіть журнал</span>
                )}
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform shrink-0 ml-1",
                    mobileInfoOpen && "rotate-180",
                  )}
                />
              </button>
            </div>

            {/* Expanded details */}
            {mobileInfoOpen && gradeBook && (
              <div className="px-3 py-2 flex flex-col gap-1.5 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Дисципліна
                  </span>
                  <span className="text-xs font-medium text-foreground text-right max-w-[55%]">
                    {gradeBook.lesson.name}, {gradeBook.lesson.semester} сем.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Група</span>
                  <span className="text-xs font-medium text-foreground">{gradeBook.group.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Викладач
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {getTeacherFullname(gradeBook.lesson.teacher, "short")}
                  </span>
                </div>

                <div className="mt-2 border-t border-border pt-2">
                  <ActionButtons
                    gradeBook={!!gradeBook}
                    stats={stats}
                    onFilter={() => setIsOpenFilterModal(true)}
                    onSummary={() => setIsOpenSummaryModal(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table area ── */}
        {!gradeBook && loadingStatus !== LoadingStatusTypes.LOADING ? (
          searchParams.toString() === "" ? (
            <Card className="py-10 flex justify-center items-center flex-1">
              <p className="font-mono">Виберіть параметри для пошуку журналу</p>
            </Card>
          ) : (
            <LoadingSpinner />
          )
        ) : !gradeBook && loadingStatus === LoadingStatusTypes.LOADING ? (
          <LoadingSpinner />
        ) : gradeBook ? (
          <GradeBookTable gradeBookLessonDates={gradeBookLessonDates} />
        ) : (
          ""
        )}
      </WideContainer>
    </>
  )
}
