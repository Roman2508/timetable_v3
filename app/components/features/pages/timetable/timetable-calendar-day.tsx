import type { Dayjs } from "dayjs";
import tinycolor from "tinycolor2";
import { Fragment, useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { customDayjs } from "~/lib/dayjs";
import { useAppDispatch } from "~/store/store";
import type { WeekType } from "~/helpers/get-calendar-week";
import type { ISelectedLesson } from "~/pages/timetable-page";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import type { SettingsType } from "~/store/settings/settings-types";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";
import { getAuditoryOverlay } from "~/store/schedule-lessons/schedule-lessons-async-actions";

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

export const colorsInitialState = {
  lectures: "rgb(255, 255, 255)",
  practical: "rgb(255, 255, 255)",
  laboratory: "rgb(255, 255, 255)",
  seminars: "rgb(255, 255, 255)",
  exams: "rgb(255, 255, 255)",
  examsConsulation: "rgb(255, 255, 255)",
};

export const convertColorKeys = {
  ["ЛК"]: "lectures",
  ["ПЗ"]: "practical",
  ["ЛАБ"]: "laboratory",
  ["СЕМ"]: "seminars",
  ["ЕКЗ"]: "exams",
  ["КОНС"]: "examsConsulation",
} as const;

function makeColorDarken(color: string, factor = 0.6) {
  const tColor = tinycolor(color);
  return tColor.darken(factor * 100).toString();
}

interface ICalendarDayProps {
  index: number;
  day: WeekType;
  selectedSemester: number;
  settings: SettingsType | null;
  isPossibleToCreateLessons: boolean;
  selectedLesson: ISelectedLesson | null;
  groupOverlay: ScheduleLessonType[] | null;
  teacherLessons: ScheduleLessonType[] | null;
  scheduleLessons: ScheduleLessonType[] | null;
  setIsAddNewLesson: Dispatch<SetStateAction<boolean>>;
  onTimeSlotClick: (data: Dayjs, lessonNumber: number) => void;
  setSeveralLessonsList: Dispatch<SetStateAction<ScheduleLessonType[]>>;
  handleOpenSeveralLessonModal: (
    scheduledElement: ScheduleLessonType,
    date: Dayjs,
    lessonNumber: number,
    auditoryId: number | null,
  ) => void;
}

const TimetableCalendarDay: FC<ICalendarDayProps> = ({
  day,
  index,
  settings,
  groupOverlay,
  selectedLesson,
  teacherLessons,
  scheduleLessons,
  onTimeSlotClick,
  selectedSemester,
  setIsAddNewLesson,
  setSeveralLessonsList,
  isPossibleToCreateLessons,
  handleOpenSeveralLessonModal,
}) => {
  const dispatch = useAppDispatch();

  const isToday = customDayjs().format("MM.DD.YYYY") === day.data.format("MM.DD.YYYY");

  const [colors, setColors] = useState(colorsInitialState);
  // if true day is outside the semester
  const [isDayOutsideTheSemester, setIsDayOutsideTheSemester] = useState(false);

  const onGetAuditoryOverlay = (_date: Dayjs, lessonNumber: number, auditoryId: number) => {
    const date = customDayjs(_date).format("YYYY.MM.DD");
    dispatch(getAuditoryOverlay({ date, lessonNumber, auditoryId }));
  };

  const checkIsAvailable = () => {
    // if return true day is outside the semester
    if (!settings) return false;

    const semesterStart =
      settings && selectedSemester === 1 ? settings.firstSemesterStart : settings.secondSemesterStart;
    const semesterEnd = settings && selectedSemester === 1 ? settings.firstSemesterEnd : settings.secondSemesterEnd;

    const isDayBeforeStartOfSemester = customDayjs(day.data).isBefore(semesterStart);
    const isDayAfterEndOfSemester = customDayjs(day.data).isAfter(semesterEnd);

    if (isDayBeforeStartOfSemester || isDayAfterEndOfSemester) return true;
    else return false;
  };

  useEffect(() => {
    setIsDayOutsideTheSemester(checkIsAvailable());
  }, [selectedSemester]);

  useEffect(() => {
    if (!settings) return;
    setColors(settings.colors);
  }, [settings]);

  return (
    <div className="border-t">
      <div
        className={cn("border-b p-2 border-r text-xs font-bold h-[33px]", isToday ? "" : "")}
        style={isToday ? { backgroundColor: "rgba(22, 119, 255, 0.08)", fontWeight: "700" } : { whiteSpace: "nowrap" }}
      >
        {dayNames[index]} {day.start}
      </div>

      {[1, 2, 3, 4, 5, 6, 7].map((lessonNumber) => {
        const lesson = scheduleLessons?.filter((el) => {
          const lessonDate = customDayjs(el.date).format("DD.MM");
          return lessonDate === day.start && el.lessonNumber === lessonNumber;
        });

        // Накладки викладача
        const overlayTeacher = teacherLessons?.find((el) => {
          const lessonDate = customDayjs(el.date).format("DD.MM");
          return lessonDate === day.start && el.lessonNumber === lessonNumber;
        });

        // Накладки групи (якщо вона об'єднана в потік)
        const overlayGroup = groupOverlay?.find((el) => {
          const lessonDate = customDayjs(el.date).format("DD.MM");
          return lessonDate === day.start && el.lessonNumber === lessonNumber;
        });

        const overlay = overlayGroup ? overlayGroup : overlayTeacher;

        const overlayTeacherName = overlay ? getTeacherFullname(overlay.teacher, "short") : "";

        return (
          <Fragment key={`${day.start}-${lessonNumber}`}>
            {!!lesson?.length && (
              <div
                className="h-25 border-b p-2 text-xs border-r overflow-hidden cursor-pointer"
                style={lesson && lesson[0] ? { backgroundColor: colors[convertColorKeys[lesson[0].typeRu]] } : {}}
              >
                {!!lesson.length &&
                  lesson.map((l) => {
                    const teacherName = lesson && lesson[0] ? getTeacherFullname(l.teacher, "short") : "";

                    const severalLessonsClassName =
                      lesson.length === 1
                        ? "lesson-1"
                        : lesson.length === 2
                        ? "lesson-2"
                        : lesson.length === 3
                        ? "lesson-3"
                        : "lesson-4";

                    const isSame =
                      selectedLesson?.group?.id !== undefined &&
                      lesson !== undefined &&
                      selectedLesson?.group?.id === l.group?.id &&
                      selectedLesson?.typeRu === l.typeRu &&
                      selectedLesson?.subgroupNumber === l.subgroupNumber &&
                      selectedLesson?.stream?.id === l.stream?.id &&
                      selectedLesson?.name === l.name;

                    return (
                      <div
                        key={l.id}
                        onClick={() => {
                          setSeveralLessonsList(lesson);
                          handleOpenSeveralLessonModal(l, day.data, lessonNumber, l.auditory ? l.auditory.id : null);
                        }}
                        className={cn(severalLessonsClassName, { selected: isSame })}
                        style={{
                          backgroundColor: colors[convertColorKeys[l.typeRu]],
                          color: makeColorDarken(colors[convertColorKeys[l.typeRu]]),
                        }}
                      >
                        {l.replacement && (
                          <p
                            className="time-slot-lesson-name"
                            style={{
                              fontWeight: 700,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              maxWidth: "150px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Заміна! {getTeacherFullname(l.replacement, "short")}
                          </p>
                        )}
                        <p className="time-slot-lesson-name">{l.name}</p>

                        <p>
                          {l.currentLessonHours < 2 ? "1 Год. " : ""}
                          {`(${l.typeRu}) 
                          ${l.subgroupNumber ? ` підгр.${l.subgroupNumber}` : ""} 
                          ${l.stream ? ` Потік ${l.stream.name} ` : ""}`}
                          {l.specialization ? `${l.specialization} спец.` : ""}
                        </p>

                        <p>{teacherName}</p>
                        <p>{l.auditory ? `${l.auditory.name} ауд.` : "Дистанційно"}</p>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Накладки викладача або групи */}
            {!lesson?.length && overlay && (
              <div
                className="h-25 border-b p-2 text-xs border-r overflow-hidden"
                style={{ color: "red", cursor: "default", padding: "2px 4px" }}
              >
                {overlay && (
                  <>
                    <p className="time-slot-lesson-name">{overlay.name}</p>
                    {overlayGroup && <p>Група {overlay.group.name}</p>}

                    <p>
                      {`(${overlay.typeRu}) 
                      ${overlay.subgroupNumber ? ` підгр.${overlay.subgroupNumber}` : ""} 
                      ${overlay.stream ? ` Потік ${overlay.stream.name} ` : ""}`}
                      {overlay.specialization ? `${overlay.specialization} спец.` : ""}
                    </p>

                    <p>{overlayTeacherName}</p>
                    <p>{overlay.auditory ? `${overlay.auditory.name} ауд.` : "Дистанційно"}</p>
                  </>
                )}
              </div>
            )}

            {/* Пустий слот */}
            {!lesson?.length && !overlay && (
              <div
                className={cn(
                  "h-25 border-b p-2 text-xs border-r overflow-hidden  cursor-pointer",
                  isDayOutsideTheSemester ? "bg-sidebar cursor-default" : "",
                )}
                onClick={() => {
                  // check is day outside a semester dates range
                  if (!isDayOutsideTheSemester) {
                    // Чи план !== факт
                    if (!isPossibleToCreateLessons) {
                      return alert("Виставлено всі ел. розкладу");
                    }

                    setIsAddNewLesson(true);
                    onTimeSlotClick(day.data, lessonNumber);
                    onGetAuditoryOverlay(day.data, lessonNumber, 0);
                  }
                }}
              ></div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default TimetableCalendarDay;
