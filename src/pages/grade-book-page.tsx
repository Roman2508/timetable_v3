import { useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router"

import { Card } from "@/components/ui/common/card"
import { Button } from "@/components/ui/common/button"
import { LoadingStatusTypes } from "@/store/app-types"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { WideContainer } from "@/components/layouts/wide-container"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import { ListFilter, NotebookPen, Printer, UnfoldVertical } from "lucide-react"
import { GradeBookTable } from "@/components/features/pages/grade-book/grade-book-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import SelectGradeBookModal from "@/components/features/pages/grade-book/select-grade-book-modal"
import GradeBookSummaryModal from "@/components/features/pages/grade-book/grade-book-summary-modal"

export default function PlansPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { gradeBook, loadingStatus } = useSelector(gradeBookSelector)

  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const [isOpenSummaryModal, setIsOpenSummaryModal] = useState(false)
  const [gradeBookLessonDates, setGradeBookLessonDates] = useState<{ date: string }[]>([])

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

      <WideContainer>
        <div className="flex justify-between mb-6 items-center">
          {gradeBook ? (
            <div className="flex gap-5">
              <div className="pr-5 border-r">
                <p className="text-xs">Дисципліна</p>
                <h3 className="text-sm font-semibold">{`${gradeBook.lesson.name}, ${gradeBook.lesson.semester} семестр`}</h3>
              </div>

              <div className="pr-5 border-r">
                <p className="text-xs">Група</p>
                <h3 className="text-sm font-semibold">{gradeBook.group.name}</h3>
              </div>

              <div>
                <p className="text-xs">Викладач</p>
                <h3 className="text-sm font-semibold">{getTeacherFullname(gradeBook.lesson.teacher, "short")}</h3>
              </div>
            </div>
          ) : (
            <p></p>
          )}

          <div className="flex items-center gap-2">
            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="outline" onClick={() => setIsOpenFilterModal(true)}>
                  <ListFilter />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Знайти електронний журнал</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="outline" onClick={() => setIsOpenSummaryModal(true)}>
                  <UnfoldVertical className="rotate-[90deg]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Додати підсумок</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="outline">
                  <NotebookPen />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Теми</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="outline">
                  <Printer />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Друк</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {!gradeBook && loadingStatus !== LoadingStatusTypes.LOADING ? (
          searchParams.toString() === "" ? (
            <Card className="py-10 text-center">
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
