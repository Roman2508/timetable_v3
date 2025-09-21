import { useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { useEffect, useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { SEMESTERS_LIST } from "@/constants"
import { useAppDispatch } from "@/store/store"
import { Button } from "@/components/ui/common/button"
import { groupsSelector } from "@/store/groups/groups-slice"
import { Separator } from "@/components/ui/common/separator"
import { sortItemsByKey } from "@/helpers/sort-items-by-key"
import { scheduleLessonsAPI } from "@/api/schedule-lessons-api"
import DropdownSelect from "@/components/ui/custom/dropdown-select"
import { clearGradeBook, deleteSummaryGradesLocally, gradeBookSelector } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookSummaryType, GradeBookType } from "@/store/gradeBook/grade-book-types"
import { addSummary, deleteSummary, getGradeBook, getLessonThemes } from "@/store/gradeBook/grade-book-async-actions"
import { lessonsForGradeBookSelector } from "@/store/schedule-lessons/schedule-lessons-slice"
import { findLessonsForSchedule } from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/select"
import { ChevronDown, Trash as DeleteIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/common/dropdown-menu"
import { cn } from "@/lib/utils"

interface IGradeBookFilterFields {
  type: (typeof summaryTypes)[number]["value"]
  afterLesson: number
}

const lessonsTabs = [
  { label: "Створити", name: "add" },
  { label: "Видалити", name: "delete" },
] as const

export const summaryTypes = [
  { label: "Тематична оцінка (ср.знач.)", value: "MODULE_AVERAGE" },
  { label: "Рейтинг з модуля (сума)", value: "MODULE_SUM" },
  { label: "Семестрова оцінка (ср.знач.)", value: "LESSON_AVERAGE" },
  { label: "Рейтинг з дисципліни (сума)", value: "LESSON_SUM" },
  { label: "Модульний контроль", value: "MODULE_TEST" },
  { label: "Додатковий рейтинг", value: "ADDITIONAL_RATE" },
  { label: "Поточний рейтинг", value: "CURRENT_RATE" },
  { label: "Екзамен", value: "EXAM" },
] as const

const defaultUserFormData: IGradeBookFilterFields = { type: summaryTypes[0].value, afterLesson: 1 }

interface IGradeBookSummaryModal {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const GradeBookSummaryModal: FC<IGradeBookSummaryModal> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch()

  const { gradeBook } = useSelector(gradeBookSelector)

  const summarySortedList = sortItemsByKey(gradeBook ? gradeBook.summary : [], "afterLesson")

  const [isFetching, setIsFetching] = useState(false)
  const [summaryType, setSummaryType] = useState<"add" | "delete">("add")
  const [userFormData, setUserFormData] = useState<IGradeBookFilterFields>(defaultUserFormData)

  const onCreateSummary = async () => {
    try {
      if (!gradeBook) return
      setIsFetching(true)
      const { afterLesson, type } = userFormData
      if (type === "LESSON_AVERAGE" || type === "LESSON_SUM" || type === "EXAM") {
        await dispatch(addSummary({ id: gradeBook.id, type, afterLesson: gradeBook.lesson.hours }))
        return
      } else {
        await dispatch(addSummary({ id: gradeBook.id, afterLesson, type }))
      }

      setOpen(false)
      setUserFormData(defaultUserFormData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const onDeleteSummary = async (type: (typeof summaryTypes)[number]["value"], afterLesson: number) => {
    try {
      if (!gradeBook) return
      if (window.confirm("Ви дійсно хочете видалити підсумок?")) {
        setIsFetching(true)
        // delete summary
        await dispatch(deleteSummary({ id: gradeBook.id, type, afterLesson }))
        // delete all summary grades
        dispatch(deleteSummaryGradesLocally({ id: gradeBook.id, type, afterLesson }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 pb-4 max-w-[450px] gap-0">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Підсумки:</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <Tabs
            className="w-full"
            defaultValue={summaryType}
            onValueChange={(value) => setSummaryType(value as "add" | "delete")}
          >
            <TabsList className="w-full">
              {lessonsTabs.map((el) => (
                <TabsTrigger key={el.name} value={el.name} className="h-[40px] w-full flex-1">
                  {el.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {summaryType === "add" && (
              <div className="p-4 pb-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex justify-between shadow-0 relative w-full mb-8">
                      <span className="absolute top-[-8px] font-sm" style={{ fontSize: "12px" }}>
                        Підсумок:
                      </span>
                      <span className="truncate">
                        {summaryTypes.find((el) => el.value === userFormData.type)?.label}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" defaultValue={userFormData.type}>
                    {summaryTypes.map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item.value}
                        className="cursor-pointer"
                        textValue={String(item.value)}
                        checked={userFormData.type === item.value}
                        onClick={() => setUserFormData({ ...userFormData, type: item.value })}
                      >
                        {item.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex justify-between shadow-0 relative w-full mb-4"
                      disabled={["LESSON_AVERAGE", "LESSON_SUM", "EXAM"].some((type) => type === userFormData.type)}
                    >
                      <span className="absolute top-[-8px] font-sm" style={{ fontSize: "12px" }}>
                        Після навчального заняття №:
                      </span>
                      <span className="truncate">{userFormData.afterLesson}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" defaultValue={userFormData.type}>
                    {[...Array(gradeBook ? gradeBook.lesson.hours : 1)].map((_, index) => (
                      <DropdownMenuCheckboxItem
                        key={index + 1}
                        className="cursor-pointer"
                        textValue={String(index + 1)}
                        checked={userFormData.afterLesson === index + 1}
                        onClick={() => setUserFormData({ ...userFormData, afterLesson: index + 1 })}
                      >
                        {index + 1}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {summaryType === "delete" && (
              <div className="pt-4 pb-0 overflow-y-auto max-h-[400px]">
                {gradeBook && gradeBook.summary.length < 1 && <p className="text-center font-mono pt-10 h-32">Пусто</p>}

                {summarySortedList.map((summary: GradeBookSummaryType, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 border-y py-2 px-4 mb-2 last:mb-8"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">Після навчального заняття: {summary.afterLesson}</p>
                      <p className="text-sm font-semibold">
                        {summaryTypes.find((type) => type.value === summary.type)?.label}
                      </p>
                    </div>

                    <Tooltip delayDuration={500}>
                      <TooltipTrigger>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onDeleteSummary(summary.type, summary.afterLesson)}
                        >
                          <DeleteIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Видалити підсумок</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-4 px-4">
          <Button disabled={isFetching || !userFormData.afterLesson || !userFormData.type} onClick={onCreateSummary}>
            {isFetching ? "Завантаження..." : "Зберегти"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GradeBookSummaryModal
