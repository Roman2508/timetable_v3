import type { Dayjs } from "dayjs"
import { useSelector } from "react-redux"
import { useCookies } from "react-cookie"
import { useState, useEffect, type FC, type Dispatch, type SetStateAction, useCallback, useMemo } from "react"

import {
  clearTeacherOverlay,
  clearAuditoryOverlay,
  scheduleLessonsSelector,
} from "@/store/schedule-lessons/schedule-lessons-slice"
import {
  getTeacherOverlay,
  getTeacherLessons,
  getAuditoryOverlay,
  getScheduleLessons,
} from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { cn } from "@/lib/utils"
import { customDayjs } from "@/lib/dayjs"
import { useAppDispatch } from "@/store/store"
import { Button } from "@/components/ui/common/button"
import { LoadingStatusTypes } from "@/store/app-types"
import LessonActionsModal from "./lesson-actions-modal"
import { TIMETABLE_WEEK } from "@/constants/cookies-keys"
import SeveralLessonsModal from "./several-lessons-modal"
import TimetableCalendarDay from "./timetable-calendar-day"
import CopyingTimetableModal from "./copying-timetable-modal"
import type { ISelectedLesson } from "@/pages/timetable-page"
import { settingsSelector } from "@/store/settings/settings-slice"
import DropdownSelect from "@/components/ui/custom/dropdown-select"
import type { TeachersType } from "@/store/teachers/teachers-types"
import SelectTeacherModal from "../../select-teacher/select-teacher-modal"
import type { AuditoriesTypes } from "@/store/auditories/auditories-types"
import getCalendarWeek, { type WeekType } from "@/helpers/get-calendar-week"
import SelectAuditoryModal from "../../select-auditory/select-auditory-modal"
import { generalSelector, setTimetableData } from "@/store/general/general-slice"
import type { ScheduleLessonType } from "@/store/schedule-lessons/schedule-lessons-types"

export interface ISelectedTimeSlot {
  data: Dayjs
  lessonNumber: number
}

interface ITimetableCalendarProps {
  weeksCount: number
  slectedGroupId: number | null
  selectedTeacherId: number | null
  isPossibleToCreateLessons: boolean
  selectedLesson: ISelectedLesson | null
  setSelectedTeacherId: Dispatch<SetStateAction<number | null>>
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>
}

const TimetableCalendar: FC<ITimetableCalendarProps> = ({
  weeksCount,
  slectedGroupId,
  selectedLesson,
  setSelectedLesson,
  selectedTeacherId,
  setSelectedTeacherId,
  isPossibleToCreateLessons,
}) => {
  const dispatch = useAppDispatch()

  const [_, setCookie] = useCookies()

  const {
    timetable: { semester, week, item, type, weeksPerPage },
  } = useSelector(generalSelector)
  const { settings } = useSelector(settingsSelector)
  const { scheduleLessons, teacherLessons, groupOverlay, loadingStatus } = useSelector(scheduleLessonsSelector)

  const [isRemote, setIsRemote] = useState(false)
  const [isAddNewLesson, setIsAddNewLesson] = useState(false)

  const [actionsModalVisible, setActionsModalVisible] = useState(false)
  const [teacherModalVisible, setTeacherModalVisible] = useState(false)
  const [auditoryModalVisible, setAuditoryModalVisible] = useState(false)
  const [severalLessonsModalVisible, setSeveralLessonsModalVisible] = useState(false)
  const [copingTimetableModalVisible, setCopingTimetableModalVisible] = useState(false)

  const [currentWeekDays, setCurrentWeekDays] = useState<WeekType[]>([])
  const [selectedAuditory, setSelectedAuditory] = useState<AuditoriesTypes | null>(null)
  const [severalLessonsList, setSeveralLessonsList] = useState<ScheduleLessonType[]>([])
  const [replacementTeacher, setReplacementTeacher] = useState<TeachersType | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ISelectedTimeSlot | null>(null)

  useEffect(() => {
    if (!item) return
    const payload = { id: item, semester: semester || 1, type: type as "group" | "teacher" | "auditory" }
    dispatch(getScheduleLessons(payload))
  }, [semester, type, item])

  useEffect(() => {
    if (!selectedTeacherId) return
    dispatch(getTeacherLessons({ id: selectedTeacherId, semester: semester || 1, type: "teacher" }))
  }, [selectedTeacherId, semester])

  useEffect(() => {
    if (!settings) return
    const { firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd } = settings

    if (semester === 1) {
      setCurrentWeekDays(getCalendarWeek(week || 1, firstSemesterStart, firstSemesterEnd))
    }
    if (semester === 2) {
      setCurrentWeekDays(getCalendarWeek(week || 1, secondSemesterStart, secondSemesterEnd))
    }
  }, [week, settings, semester])

  useEffect(() => {
    if (!selectedTimeSlot) return
    const date = customDayjs(selectedTimeSlot?.data, { format: "YYYY.MM.DD" }).format("YYYY.MM.DD")
    // Очищаю список накладок які вже були завантажені
    dispatch(clearTeacherOverlay())
    // Отримаю список нових (актуальних) накладок
    dispatch(getTeacherOverlay({ date, lessonNumber: selectedTimeSlot.lessonNumber }))
  }, [selectedTimeSlot])

  const setToday = useCallback(() => {
    if (!settings) return

    const now = customDayjs()
    const { firstSemesterStart, firstSemesterEnd, secondSemesterEnd, secondSemesterStart } = settings

    ;[...Array(weeksCount)].forEach((_, index) => {
      const weekNumber = index + 1

      let weekDays

      if (semester === 1) {
        weekDays = getCalendarWeek(weekNumber, firstSemesterStart, firstSemesterEnd)
      } else {
        weekDays = getCalendarWeek(weekNumber, secondSemesterStart, secondSemesterEnd)
      }

      const isAfter = now.isAfter(weekDays[0].data)
      const isBefore = now.isBefore(weekDays[6].data)

      if (isBefore && isAfter) {
        setCookie(TIMETABLE_WEEK, weekNumber)
        dispatch(setTimetableData({ week: weekNumber }))
      }
    })
  }, [settings, weeksCount, semester, dispatch])

  const isTodayDisabled = useMemo(() => {
    if (!settings || weeksCount < 1) return true

    const { firstSemesterStart, firstSemesterEnd, secondSemesterEnd, secondSemesterStart } = settings

    let semesterStart
    let semesterEnd

    if (semester === 2) {
      semesterStart = getCalendarWeek(1, secondSemesterStart, secondSemesterEnd)[0]
      semesterEnd = getCalendarWeek(weeksCount, secondSemesterStart, secondSemesterEnd)[6]
    } else {
      semesterStart = getCalendarWeek(1, firstSemesterStart, firstSemesterEnd)[0]
      semesterEnd = getCalendarWeek(weeksCount, firstSemesterStart, firstSemesterEnd)[6]
    }

    const isTodayBeforeFirstSemesterDate = customDayjs().isBefore(semesterStart.data)
    const isTodayAfterLastSemesterDate = customDayjs().isAfter(semesterEnd.data)

    if (isTodayBeforeFirstSemesterDate || isTodayAfterLastSemesterDate) {
      return true
    }

    return false
  }, [settings, weeksCount, semester])

  // select date and time and open creating lessons modal
  const onTimeSlotClick = (data: Dayjs, lessonNumber: number, skip = true) => {
    // skip = Якщо skip = true то необхідно перевірити чи вибрано дисципліну, якщо false то така перевірка не потрібна
    // бо був клік на виставлений ел.розкладу в календарі
    if (!selectedLesson && skip) {
      //   toast.warning("Дисципліна не вибрана", { duration: 3000 });
      return
    }
    // if (!selectedLesson) return alert("Дисципліна не вибрана")
    setSelectedTimeSlot({ data, lessonNumber })
    setActionsModalVisible(true)
  }

  const onGetAuditoryOverlay = (_date: Dayjs, lessonNumber: number, auditoryId: number) => {
    const date = customDayjs(_date).format("YYYY.MM.DD")
    dispatch(clearAuditoryOverlay()) // Очищаю старі накладки
    dispatch(getAuditoryOverlay({ date, lessonNumber, auditoryId })) // Отримую нові (актуальні) накладки для вибраного ел.розкладу
  }

  // on click in schedule lesson item
  const onEditLesson = (lesson: ScheduleLessonType, data: Dayjs, lessonNumber: number) => {
    const auditory = lesson.auditory ? lesson.auditory.id : null
    setIsRemote(!auditory)
    setSelectedLesson({
      id: lesson.id,
      name: lesson.name,
      typeRu: lesson.typeRu,
      stream: lesson.stream,
      teacher: lesson.teacher,
      totalHours: lesson.hours,
      students: lesson.students,
      replacement: lesson.replacement,
      subgroupNumber: lesson.subgroupNumber,
      specialization: lesson.specialization,
      currentLessonHours: lesson.currentLessonHours,
      group: { id: lesson.group.id, name: lesson.group.name },
    })
    setSelectedTeacherId(lesson.teacher.id)
    const replacementTeacher = lesson.replacement ? lesson.replacement : null
    setReplacementTeacher(replacementTeacher)
    onTimeSlotClick(data, lessonNumber, false)
  }

  const handleOpenSeveralLessonModal = (
    scheduledElement: ScheduleLessonType,
    date: Dayjs,
    lessonNumber: number,
    auditoryId: number | null,
  ) => {
    // selectedLesson - елемент розкладу, який зараз вибраний
    // scheduledElement - елемент розкладу, який вже виставлений

    const auditory = auditoryId ? auditoryId : 0

    if (!selectedLesson) {
      onEditLesson(scheduledElement, date, lessonNumber)
      dispatch(clearAuditoryOverlay()) // Очищаю старі накладки
      onGetAuditoryOverlay(date, lessonNumber, auditory) // Отримую нові (актуальні) накладки для вибраного ел.розкладу
      return
    }

    const isLessonsSame =
      scheduledElement.name === selectedLesson?.name &&
      scheduledElement.group.id === selectedLesson?.group.id &&
      scheduledElement.stream?.id === selectedLesson?.stream?.id &&
      scheduledElement.subgroupNumber === selectedLesson?.subgroupNumber &&
      scheduledElement.typeRu === selectedLesson?.typeRu &&
      scheduledElement.specialization === selectedLesson?.specialization

    // Якщо виставлений ел. розкладу і вибраний - це одна і та ж дисципліна
    if (isLessonsSame) {
      onEditLesson(scheduledElement, date, lessonNumber)
      dispatch(clearAuditoryOverlay()) // Очищаю старі накладки
      onGetAuditoryOverlay(date, lessonNumber, auditory) // Отримую нові (актуальні) накладки для вибраного ел.розкладу
      return
    }

    // Якщо дисципліна на яку нажато в календарі немає підгруп або спецгруп - вона не може читатись одночасно з іншою
    const isScheduleElementCanStandWithOther = scheduledElement.subgroupNumber || scheduledElement.specialization
    // Дисципліна яку вибрано може читатись одночасно з іншими коли вона має підгрупу або спецгрупу
    const isSelectedLessonHasSubgroupsOrSpecialization = selectedLesson.subgroupNumber || selectedLesson.specialization

    if (isScheduleElementCanStandWithOther && isSelectedLessonHasSubgroupsOrSpecialization) {
      // Перевіряю чи може вибрана дисципліна стояти з іншими в один час
      // Може якщо вона розбита на підгрупи або якщо вона має спец. групи
      // if (selectedLesson.subgroupNumber || selectedLesson.specialization) {
      setSelectedTimeSlot({ data: date, lessonNumber })
      setSeveralLessonsModalVisible(true)
    } else {
      // Якщо дисципліна не поділена на підгрупи і не має спец. груп
      onEditLesson(scheduledElement, date, lessonNumber)
      onGetAuditoryOverlay(date, lessonNumber, auditory)
    }
  }

  return (
    <>
      <LessonActionsModal
        isRemote={isRemote}
        open={actionsModalVisible}
        currentWeekNumber={week || 1}
        isAddNewLesson={isAddNewLesson}
        selectedLesson={selectedLesson}
        setOpen={setActionsModalVisible}
        selectedTimeSlot={selectedTimeSlot}
        selectedAuditory={selectedAuditory}
        setIsAddNewLesson={setIsAddNewLesson}
        setSelectedAuditory={setSelectedAuditory}
        selectedSemester={(semester as 1 | 2) || 1}
        setSeveralLessonsList={setSeveralLessonsList}
        setTeacherModalVisible={setTeacherModalVisible}
        setAuditoryModalVisible={setAuditoryModalVisible}
        setSeveralLessonsModalVisible={setSeveralLessonsModalVisible}
      />

      <CopyingTimetableModal
        groupId={slectedGroupId}
        open={copingTimetableModalVisible}
        setOpen={setCopingTimetableModalVisible}
      />

      <SeveralLessonsModal
        settings={settings}
        selectedLesson={selectedLesson}
        open={severalLessonsModalVisible}
        selectedTimeSlot={selectedTimeSlot}
        setIsAddNewLesson={setIsAddNewLesson}
        setSelectedLesson={setSelectedLesson}
        setOpen={setSeveralLessonsModalVisible}
        severalLessonsList={severalLessonsList}
        setSelectedAuditory={setSelectedAuditory}
        setSelectedTeacherId={setSelectedTeacherId}
        onGetAuditoryOverlay={onGetAuditoryOverlay}
        setActionsModalVisible={setActionsModalVisible}
      />

      <SelectTeacherModal
        open={teacherModalVisible}
        setOpen={setTeacherModalVisible}
        setSelectedLesson={setSelectedLesson}
        replacementTeacher={replacementTeacher}
        setReplacementTeacher={setReplacementTeacher}
        setActionsModalVisible={setActionsModalVisible}
        selectedLessonId={selectedLesson ? selectedLesson.id : null}
        isReplacementExist={selectedLesson && selectedLesson.replacement ? true : false}
      />

      <SelectAuditoryModal
        isRemote={isRemote}
        setIsRemote={setIsRemote}
        open={auditoryModalVisible}
        setOpen={setAuditoryModalVisible}
        selectedAuditory={selectedAuditory}
        setSelectedAuditory={setSelectedAuditory}
        setLessonActionsModalVisible={setActionsModalVisible}
      />

      <div className="w-7/10 border-t shadow-sm rounded-md overflow-hidden">
        <div className="flex border-x">
          <div className="flex justify-between w-full 2xl:flex-row flex-col items-center">
            <div className="flex gap-2 p-2">
              <Button variant="outline" className="select-none" size="sm" disabled={isTodayDisabled} onClick={setToday}>
                Сьогодні
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="select-none"
                disabled={week === 1 || !week}
                onClick={() => {
                  if (week) {
                    // setCookie(TIMETABLE_WEEK, week - 1)
                    dispatch(setTimetableData({ week: week - 1 }))
                  }
                }}
              >
                Попередній тиждень
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="select-none"
                disabled={week === weeksCount}
                onClick={() => {
                  if (week) {
                    // setCookie(TIMETABLE_WEEK, week + 1)
                    dispatch(setTimetableData({ week: week + 1 }))
                  }
                }}
              >
                Наступний тиждень
              </Button>
            </div>

            <div className="2xl:p-2 pb-2 flex gap-2">
              <DropdownSelect
                isLabelInside
                size="sm"
                classNames="2xl:w-45 w-36"
                label="Днів на тиждень"
                selectedItem={weeksPerPage || 7}
                items={[
                  { id: 5, name: "5" },
                  { id: 6, name: "6" },
                  { id: 7, name: "7" },
                ]}
                onChange={(weeksPerPage) => dispatch(setTimetableData({ weeksPerPage }))}
              />

              {type === "group" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="select-none"
                  onClick={() => setCopingTimetableModalVisible(true)}
                >
                  Копіювати розклад
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className={cn("flex", loadingStatus === LoadingStatusTypes.LOADING ? "opacity-[0.3]" : "")}>
          <div className="w-6 border-l">
            <div className="border-t h-[33px]"></div>

            {[1, 2, 3, 4, 5, 6, 7].map((lessonNumber) => {
              const classNames = lessonNumber === 7 ? "2xl:h-[101px] h-[81px] border-y" : "2xl:h-25 h-20 border-t"
              return (
                <div className={cn("text-xs font-bold p-2", classNames)} key={lessonNumber}>
                  {lessonNumber}
                </div>
              )
            })}
          </div>

          <div className="w-full border-l grid" style={{ gridTemplateColumns: `repeat(${weeksPerPage || 7}, 1fr)` }}>
            {currentWeekDays?.map((day, index) => {
              // Приховати неділю
              if (weeksPerPage === 6 && index === 6) return
              // Приховати суботу та неділю
              if (weeksPerPage === 5 && (index === 5 || index === 6)) return

              return (
                <TimetableCalendarDay
                  day={day}
                  index={index}
                  key={day.start}
                  settings={settings}
                  groupOverlay={groupOverlay}
                  selectedLesson={selectedLesson}
                  teacherLessons={teacherLessons}
                  selectedSemester={semester || 1}
                  scheduleLessons={scheduleLessons}
                  onTimeSlotClick={onTimeSlotClick}
                  setIsAddNewLesson={setIsAddNewLesson}
                  setSelectedAuditory={setSelectedAuditory}
                  setSeveralLessonsList={setSeveralLessonsList}
                  isPossibleToCreateLessons={isPossibleToCreateLessons}
                  isLoading={loadingStatus === LoadingStatusTypes.LOADING}
                  handleOpenSeveralLessonModal={handleOpenSeveralLessonModal}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default TimetableCalendar
