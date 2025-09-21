import { useSelector } from "react-redux"
import { type SetURLSearchParams } from "react-router"
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
import { clearGradeBook } from "@/store/gradeBook/grade-book-slice"
import type { GradeBookType } from "@/store/gradeBook/grade-book-types"
import { getGradeBook, getLessonThemes } from "@/store/gradeBook/grade-book-async-actions"
import { lessonsForGradeBookSelector } from "@/store/schedule-lessons/schedule-lessons-slice"
import { findLessonsForSchedule } from "@/store/schedule-lessons/schedule-lessons-async-actions"

interface ISelectGradeBookModal {
  open: boolean
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
  setOpen: Dispatch<SetStateAction<boolean>>
  setGradeBookLessonDates: Dispatch<SetStateAction<{ date: string }[]>>
}

const SelectGradeBookModal: FC<ISelectGradeBookModal> = ({
  open,
  setOpen,
  searchParams,
  setSearchParams,
  setGradeBookLessonDates,
}) => {
  const dispatch = useAppDispatch()

  const { lessons } = useSelector(lessonsForGradeBookSelector)
  const lessonsList = useMemo(
    () =>
      lessons.map((el) => {
        const unitInfo = el.subgroupNumber ? `(${el.subgroupNumber} підгрупа)` : "(Вся група)"
        return { id: el.id, name: `${el.typeRu} / ${el.name} ${unitInfo}` }
      }),
    [lessons],
  )

  const { groupCategories } = useSelector(groupsSelector)
  const groupList = useMemo(() => (groupCategories || []).flatMap((el) => el.groups), [groupCategories])

  const [isFetching, setIsFetching] = useState(false)
  const [userFormData, setUserFormData] = useState({})

  const formData = {
    lessonType: searchParams.get("lessonType"),
    groupId: Number(searchParams.get("groupId")),
    semester: Number(searchParams.get("semester")),
    lessonId: Number(searchParams.get("lessonId")),
    ...userFormData,
  }

  const isSubmitDisabled = !formData.groupId || !formData.semester || !formData.lessonId

  const fetchGradeBook = async (groupId: number, lessonId: number, semester: number, lessonType: string) => {
    const { payload } = await dispatch(
      getGradeBook({
        group: groupId,
        lesson: lessonId,
        semester: semester,
        // @ts-ignore
        type: lessonType,
      }),
    )

    const selectedGroup = groupList.find((el) => el.id === groupId)

    if (selectedGroup) {
      // alert("Треба знайти рік вступу групи і до нього додавати курс навчання");
      dispatch(getLessonThemes({ id: lessonId, year: selectedGroup.yearOfAdmission + selectedGroup.courseNumber }))
    }

    const gradeBook = payload as GradeBookType

    const findLessonsPayload: any = {
      semester,
      groupId: gradeBook.group.id,
      type: gradeBook.lesson.typeRu,
      lessonName: gradeBook.lesson.name,
    }

    const stream = gradeBook.lesson.stream ? gradeBook.lesson.stream.id : null
    const specialization = gradeBook.lesson.specialization ? gradeBook.lesson.specialization : null
    const subgroupNumber = gradeBook.lesson.subgroupNumber ? gradeBook.lesson.subgroupNumber : null

    if (stream) findLessonsPayload.stream = stream
    if (specialization) findLessonsPayload.specialization = specialization
    if (subgroupNumber) findLessonsPayload.subgroupNumber = subgroupNumber

    const dates = await scheduleLessonsAPI.findAllLessonDatesForTheSemester(findLessonsPayload)

    const sortedDates = sortItemsByKey(dates.data, "date")
    setGradeBookLessonDates(sortedDates)
  }

  const onSubmit = async () => {
    const { groupId, lessonId, semester, lessonType } = formData
    if (!groupId || !lessonId || !semester || !lessonType) {
      alert("Вибрані не всі параметри")
      return
    }

    setSearchParams({
      groupId: String(groupId),
      lessonId: String(lessonId),
      semester: String(semester),
      lessonType: String(lessonType),
    })
    dispatch(clearGradeBook())
    setIsFetching(true)
    // await fetchGradeBook(groupId, lessonId, semester, lessonType);
    setOpen(false)
  }

  useEffect(() => {
    if (!formData.semester || !formData.groupId) return
    const payload = { semester: +formData.semester, itemId: +formData.groupId, scheduleType: "group" } as const
    dispatch(findLessonsForSchedule(payload))
  }, [formData.groupId, formData.semester])

  useEffect(() => {
    const groupId = searchParams.get("groupId")
    const lessonId = searchParams.get("lessonId")
    const semester = searchParams.get("semester")
    const lessonType = searchParams.get("lessonType")

    if (!groupId || !lessonId || !semester || !lessonType) return
    const getGradeBookAsync = async () => {
      try {
        setIsFetching(true)
        await fetchGradeBook(Number(groupId), Number(lessonId), Number(semester), lessonType)
      } finally {
        setIsFetching(false)
      }
    }
    getGradeBookAsync()
  }, [searchParams])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 max-w-[450px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Електронний журнал:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">Виберіть критерії для пошуку електронного журналу</p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <div className="p-4 pb-0">
            <DropdownSelect
              label="Група"
              items={groupList}
              classNames="w-full mb-6"
              selectedItem={formData.groupId}
              onChange={(groupId) => setUserFormData((prev) => ({ ...prev, groupId }))}
            />

            <DropdownSelect
              label="Семестр"
              items={SEMESTERS_LIST}
              classNames="w-full mb-6"
              selectedItem={formData.semester}
              onChange={(semester) => setUserFormData((prev) => ({ ...prev, semester }))}
            />

            <DropdownSelect
              label="Дисципліна"
              items={lessonsList}
              classNames="w-full mb-6"
              selectedItem={formData.lessonId}
              onChange={(lessonId) => {
                setUserFormData((prev) => ({ ...prev, lessonId }))
                const selectedLesson = lessons.find((el) => el.id === lessonId)
                if (selectedLesson) {
                  setUserFormData((prev) => ({ ...prev, lessonType: selectedLesson.typeRu }))
                }
              }}
            />
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button onClick={onSubmit} disabled={isFetching || isSubmitDisabled}>
            {isFetching ? "Завантаження..." : "Вибрати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectGradeBookModal
