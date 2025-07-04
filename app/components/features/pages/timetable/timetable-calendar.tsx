import type { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useState, useEffect, type FC, type Dispatch, type SetStateAction, useCallback, useMemo } from "react";

import {
  clearTeacherOverlay,
  setLastSelectedData,
  clearAuditoryOverlay,
  scheduleLessonsSelector,
  lastSelectedDataSelector,
} from "~/store/schedule-lessons/schedule-lessons-slice";
import {
  getTeacherOverlay,
  getTeacherLessons,
  getAuditoryOverlay,
  getScheduleLessons,
} from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { cn } from "~/lib/utils";
import { customDayjs } from "~/lib/dayjs";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { LoadingStatusTypes } from "~/store/app-types";
import LessonActionsModal from "./lesson-actions-modal";
import getCalendarWeek from "~/helpers/get-calendar-week";
import { TIMETABLE_WEEK } from "~/constants/cookies-keys";
import TimetableCalendarDay from "./timetable-calendar-day";
import type { ISelectedLesson } from "~/pages/timetable-page";
import { settingsSelector } from "~/store/settings/settings-slice";
import { generalSelector, setTimetableData } from "~/store/general/general-slice";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";

export interface ISelectedTimeSlot {
  data: Dayjs;
  lessonNumber: number;
}

interface ITimetableCalendarProps {
  weeksCount: number;
  slectedGroupId: number | null;
  selectedTeacherId: number | null;
  selectedAuditoryId: number | null;
  isPossibleToCreateLessons: boolean;
  selectedLesson: ISelectedLesson | null;
  setSelectedTeacherId: Dispatch<SetStateAction<number | null>>;
  setSelectedAuditoryId: Dispatch<SetStateAction<number | null>>;
  setCopyTheScheduleModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>;
}

const TimetableCalendar: FC<ITimetableCalendarProps> = ({
  weeksCount,
  selectedLesson,
  setSelectedLesson,
  selectedTeacherId,
  selectedAuditoryId,
  setSelectedTeacherId,
  setSelectedAuditoryId,
  isPossibleToCreateLessons,
  setCopyTheScheduleModalVisible,
}) => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  const {
    timetable: { semester, week, item, category, type },
  } = useSelector(generalSelector);
  const { settings } = useSelector(settingsSelector);
  const { scheduleLessons, teacherLessons, groupOverlay, loadingStatus } = useSelector(scheduleLessonsSelector);

  const [isRemote, setIsRemote] = useState(false);
  const [modalVisible, setModalVisible] = useState(true); ///////
  const [isAddNewLesson, setIsAddNewLesson] = useState(false);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [auditoryModalVisible, setAuditoryModalVisible] = useState(false);

  const [selectedAuditoryName, setSelectedAuditoryName] = useState("");
  const [severalLessonsModalVisible, setSeveralLessonsModalVisible] = useState(false);
  const [replacementTeacherId, setReplacementTeacherId] = useState<number | null>(null);
  const [severalLessonsList, setSeveralLessonsList] = useState<ScheduleLessonType[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<ISelectedTimeSlot | null>(null);
  const [currentWeekDays, setCurrentWeekDays] = useState(getCalendarWeek(week || 1));

  //

  //   useEffect(() => {
  //     if (!item) return;
  //     const payload = { id: item, semester: semester || 1, type: type as "group" | "teacher" | "auditory" };
  //     dispatch(getScheduleLessons(payload));
  //   }, [semester, type, item]);

  //

  useEffect(() => {
    if (!selectedTeacherId) return;
    dispatch(getTeacherLessons({ id: selectedTeacherId, semester: semester || 1, type: "teacher" }));
  }, [selectedTeacherId, semester]);

  useEffect(() => {
    if (!settings) return;
    const { firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd } = settings;

    if (semester === 1) {
      setCurrentWeekDays(getCalendarWeek(week || 1, firstSemesterStart, firstSemesterEnd));
    }
    if (semester === 2) {
      setCurrentWeekDays(getCalendarWeek(week || 1, secondSemesterStart, secondSemesterEnd));
    }
  }, [week, settings, semester]);

  useEffect(() => {
    if (!selectedTimeSlot) return;
    const date = customDayjs(selectedTimeSlot?.data, { format: "YYYY.MM.DD" }).format("YYYY.MM.DD");
    // Очищаю список накладок які вже були завантажені
    dispatch(clearTeacherOverlay());
    // Отримаю список нових (актуальних) накладок
    dispatch(getTeacherOverlay({ date, lessonNumber: selectedTimeSlot.lessonNumber }));
  }, [selectedTimeSlot]);

  const setToday = useCallback(() => {
    if (!settings) return;

    const now = customDayjs();
    const { firstSemesterStart, firstSemesterEnd, secondSemesterEnd, secondSemesterStart } = settings;

    [...Array(weeksCount)].forEach((_, index) => {
      const weekNumber = index + 1;

      let weekDays;

      if (semester === 1) {
        weekDays = getCalendarWeek(weekNumber, firstSemesterStart, firstSemesterEnd);
      } else {
        weekDays = getCalendarWeek(weekNumber, secondSemesterStart, secondSemesterEnd);
      }

      const isAfter = now.isAfter(weekDays[0].data);
      const isBefore = now.isBefore(weekDays[6].data);

      if (isBefore && isAfter) {
        setCookie(TIMETABLE_WEEK, weekNumber);
        dispatch(setTimetableData({ week: weekNumber }));
      }
    });
  }, [settings, weeksCount, semester, dispatch]);

  const isTodayDisabled = useMemo(() => {
    if (!settings || weeksCount < 1) return true;

    const { firstSemesterStart, firstSemesterEnd, secondSemesterEnd, secondSemesterStart } = settings;

    let semesterStart;
    let semesterEnd;

    if (semester === 2) {
      semesterStart = getCalendarWeek(1, secondSemesterStart, secondSemesterEnd)[0];
      semesterEnd = getCalendarWeek(weeksCount, secondSemesterStart, secondSemesterEnd)[6];
    } else {
      semesterStart = getCalendarWeek(1, firstSemesterStart, firstSemesterEnd)[0];
      semesterEnd = getCalendarWeek(weeksCount, firstSemesterStart, firstSemesterEnd)[6];
    }

    const isTodayBeforeFirstSemesterDate = customDayjs().isBefore(semesterStart.data);
    const isTodayAfterLastSemesterDate = customDayjs().isAfter(semesterEnd.data);

    if (isTodayBeforeFirstSemesterDate || isTodayAfterLastSemesterDate) {
      return true;
    }

    return false;
  }, [settings, weeksCount, semester]);

  // select date and time and open creating lessons modal
  const onTimeSlotClick = (data: Dayjs, lessonNumber: number, skip = true) => {
    // skip = Якщо skip = true то необхідно перевірити чи вибрано дисципліну, якщо false то така перевірка не потрібна
    // бо був клік на виставлений ел.розкладу в календарі
    if (!selectedLesson && skip) {
      //   toast.warning("Дисципліна не вибрана", { duration: 3000 });
      return;
    }
    // if (!selectedLesson) return alert("Дисципліна не вибрана")
    setSelectedTimeSlot({ data, lessonNumber });
    setModalVisible(true);
  };

  const onGetAuditoryOverlay = (_date: Dayjs, lessonNumber: number, auditoryId: number) => {
    const date = customDayjs(_date).format("YYYY.MM.DD");
    dispatch(clearAuditoryOverlay()); // Очищаю старі накладки
    dispatch(getAuditoryOverlay({ date, lessonNumber, auditoryId })); // Отримую нові (актуальні) накладки для вибраного ел.розкладу
  };

  // on click in schedule lesson item
  const onEditLesson = (lesson: ScheduleLessonType, data: Dayjs, lessonNumber: number) => {
    const auditory = lesson.auditory ? lesson.auditory.id : null;
    setIsRemote(!auditory);
    setSelectedAuditoryId(auditory);
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
    });
    setSelectedTeacherId(lesson.teacher.id);
    const replacement = lesson.replacement ? lesson.replacement.id : null;
    setReplacementTeacherId(replacement);
    onTimeSlotClick(data, lessonNumber, false);
  };

  const handleOpenSeveralLessonModal = (
    scheduledElement: ScheduleLessonType,
    date: Dayjs,
    lessonNumber: number,
    auditoryId: number | null,
  ) => {
    // selectedLesson - елемент розкладу, який зараз вибраний
    // scheduledElement - елемент розкладу, який вже виставлений

    const auditory = auditoryId ? auditoryId : 0;

    if (!selectedLesson) {
      onEditLesson(scheduledElement, date, lessonNumber);
      dispatch(clearAuditoryOverlay()); // Очищаю старі накладки
      onGetAuditoryOverlay(date, lessonNumber, auditory); // Отримую нові (актуальні) накладки для вибраного ел.розкладу
      return;
    }

    const isLessonsSame =
      scheduledElement.name === selectedLesson?.name &&
      scheduledElement.group.id === selectedLesson?.group.id &&
      scheduledElement.stream?.id === selectedLesson?.stream?.id &&
      scheduledElement.subgroupNumber === selectedLesson?.subgroupNumber &&
      scheduledElement.typeRu === selectedLesson?.typeRu &&
      scheduledElement.specialization === selectedLesson?.specialization;

    // Якщо виставлений ел. розкладу і вибраний - це одна і та ж дисципліна
    if (isLessonsSame) {
      onEditLesson(scheduledElement, date, lessonNumber);
      dispatch(clearAuditoryOverlay()); // Очищаю старі накладки
      onGetAuditoryOverlay(date, lessonNumber, auditory); // Отримую нові (актуальні) накладки для вибраного ел.розкладу
      return;
    }

    // Якщо дисципліна на яку нажато в календарі немає підгруп або спецгруп - вона не може читатись одночасно з іншою
    const isScheduleElementCanStandWithOther = scheduledElement.subgroupNumber || scheduledElement.specialization;
    // Дисципліна яку вибрано може читатись одночасно з іншими коли вона має підгрупу або спецгрупу
    const isSelectedLessonHasSubgroupsOrSpecialization = selectedLesson.subgroupNumber || selectedLesson.specialization;

    if (isScheduleElementCanStandWithOther && isSelectedLessonHasSubgroupsOrSpecialization) {
      // Перевіряю чи може вибрана дисципліна стояти з іншими в один час
      // Може якщо вона розбита на підгрупи або якщо вона має спец. групи
      // if (selectedLesson.subgroupNumber || selectedLesson.specialization) {
      setSelectedTimeSlot({ data: date, lessonNumber });
      setSeveralLessonsModalVisible(true);
    } else {
      // Якщо дисципліна не поділена на підгрупи і не має спец. груп
      onEditLesson(scheduledElement, date, lessonNumber);
      onGetAuditoryOverlay(date, lessonNumber, auditory);
    }
  };

  return (
    <>
      <LessonActionsModal
        isRemote={isRemote}
        open={modalVisible}
        setOpen={setModalVisible}
        currentWeekNumber={week || 1}
        isAddNewLesson={isAddNewLesson}
        selectedLesson={selectedLesson}
        selectedTimeSlot={selectedTimeSlot}
        setIsAddNewLesson={setIsAddNewLesson}
        selectedAuditoryId={selectedAuditoryId}
        selectedSemester={(semester as 1 | 2) || 1}
        selectedAuditoryName={selectedAuditoryName}
        setSeveralLessonsList={setSeveralLessonsList}
        setTeacherModalVisible={setTeacherModalVisible}
        setAuditoryModalVisible={setAuditoryModalVisible}
        setSelectedAuditoryName={setSelectedAuditoryName}
        setSeveralLessonsModalVisible={setSeveralLessonsModalVisible}
      />

      <div className="w-7/10 border-t">
        <div className="flex border-x">
          <div className="flex justify-between w-full">
            <div className="flex gap-2 p-2">
              <Button variant="outline" size="sm" disabled={isTodayDisabled} onClick={setToday}>
                Сьогодні
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={week === 1 || !week}
                onClick={() => {
                  if (week) {
                    setCookie(TIMETABLE_WEEK, week - 1);
                    dispatch(setTimetableData({ week: week - 1 }));
                  }
                }}
              >
                Попередній тиждень
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={week === weeksCount}
                onClick={() => {
                  if (week) {
                    setCookie(TIMETABLE_WEEK, week + 1);
                    dispatch(setTimetableData({ week: week + 1 }));
                  }
                }}
              >
                Наступний тиждень
              </Button>
            </div>

            {type === "group" && (
              <div className="p-2">
                <Button variant="outline" size="sm" onClick={() => setCopyTheScheduleModalVisible(true)}>
                  Копіювати розклад
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className={cn("flex", loadingStatus === LoadingStatusTypes.LOADING ? "opacity-[0.3]" : "")}>
          <div className="w-6 border-l">
            <div className="h-8 border-t h-[33px]"></div>

            {[1, 2, 3, 4, 5, 6, 7].map((lessonNumber) => {
              const classNames = lessonNumber === 7 ? "h-[101px] border-y" : "h-25 border-t";
              return (
                <div className={cn("text-xs font-bold p-2", classNames)} key={lessonNumber}>
                  {lessonNumber}
                </div>
              );
            })}
          </div>

          <div className="w-full border-l grid grid-cols-7">
            {currentWeekDays.map((day, index) => (
              <TimetableCalendarDay
                index={index}
                day={day}
                key={day.start}
                settings={settings}
                groupOverlay={groupOverlay}
                selectedLesson={selectedLesson}
                teacherLessons={teacherLessons}
                selectedSemester={semester || 1}
                scheduleLessons={scheduleLessons}
                onTimeSlotClick={onTimeSlotClick}
                setIsAddNewLesson={setIsAddNewLesson}
                setSeveralLessonsList={setSeveralLessonsList}
                isPossibleToCreateLessons={isPossibleToCreateLessons}
                handleOpenSeveralLessonModal={handleOpenSeveralLessonModal}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimetableCalendar;
