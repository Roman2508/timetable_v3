import { useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { useEffect, useMemo, useState } from "react"
import { Users, BookOpen, BarChart3, TrendingUp, ChevronDown, GraduationCap, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { LoadingStatusTypes } from "@/store/app-types"
import { calcAvg } from "@/helpers/grade-book-stats/calc-avg"
import { calcApu } from "@/helpers/grade-book-stats/calc-apu"
import { calcYapu } from "@/helpers/grade-book-stats/calc-yapu"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { WideContainer } from "@/components/layouts/wide-container"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { InfoChip } from "@/components/features/grade-book/info-chip"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { calcAbsences } from "@/helpers/grade-book-stats/calc-absences"
import { getGroupCategories } from "@/store/groups/groups-async-actions"
import { GradeBookTable } from "@/components/features/pages/grade-book/grade-book-table"
import { ActionButtons, type StatItem } from "@/components/features/grade-book/action-buttons"
import SelectGradeBookModal from "@/components/features/pages/grade-book/select-grade-book-modal"
import GradeBookSummaryModal from "@/components/features/pages/grade-book/grade-book-summary-modal"

const GradeBookPage = () => {
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
      { label: "Пропусків", value: String(calcAbsences(g)), icon: AlertTriangle, color: "text-destructive bg-destructive/8" },
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

      <WideContainer classNames="h-full flex flex-col max-h-[calc(100vh-51px)]">
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

export default GradeBookPage
