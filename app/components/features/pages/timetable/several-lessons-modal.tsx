import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { AlertDialogHeader } from "~/components/ui/common/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "~/components/ui/common/dialog";
import type { SettingsType } from "~/store/settings/settings-types";
import type { ISelectedLesson } from "~/pages/timetable-page";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";
import type { ISelectedTimeSlot } from "./timetable-calendar";
import type { Dayjs } from "dayjs";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { convertColorKeys } from "./timetable-calendar-day";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";

const dayNames = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

const lessonsTime = [
  "08:30 – 09:50",
  "10:00 – 11:20",
  "12:00 – 13:20",
  "13:30 – 14:50",
  "15:00 – 16:20",
  "16:30 – 17:50",
  "18:00 – 19:20",
];

export const colors = {
  ["ЛК"]: "rgb(232, 255, 82)",
  ["ПЗ"]: "rgb(24, 176, 71)",
  ["ЛАБ"]: "rgb(43, 163, 185)",
  ["СЕМ"]: "rgb(82, 27, 172)",
  ["ЕКЗ"]: "rgb(176, 24, 24)",
};

interface ISeveralLessonsModalProps {
  open: boolean;
  settings: SettingsType | null;
  selectedLesson: ISelectedLesson | null;
  severalLessonsList: ScheduleLessonType[];
  selectedTimeSlot: ISelectedTimeSlot | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddNewLesson: Dispatch<SetStateAction<boolean>>;
  setActionsModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedTeacherId: Dispatch<SetStateAction<number | null>>;
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>;
  setSelectedAuditory: Dispatch<SetStateAction<AuditoriesTypes | null>>;
  onGetAuditoryOverlay: (_date: Dayjs, lessonNumber: number, auditoryId: number) => void;
}

const SeveralLessonsModal: FC<ISeveralLessonsModalProps> = ({
  open,
  setOpen,
  settings,
  selectedLesson,
  selectedTimeSlot,
  setIsAddNewLesson,
  setSelectedLesson,
  severalLessonsList,
  setSelectedAuditory,
  setSelectedTeacherId,
  onGetAuditoryOverlay,
  setActionsModalVisible,
}) => {
  const [dayName, setDayName] = useState("");

  const onSelectLesson = (lesson: ScheduleLessonType) => {
    if (!selectedTimeSlot) return;
    const auditory = lesson.auditory ? lesson.auditory.id : null;

    onGetAuditoryOverlay(selectedTimeSlot.data, selectedTimeSlot.lessonNumber, auditory ? auditory : 0);
    setSelectedLesson({
      id: lesson.id,
      name: lesson.name,
      typeRu: lesson.typeRu,
      stream: lesson.stream,
      teacher: lesson.teacher,
      totalHours: lesson.hours,
      students: lesson.students,
      subgroupNumber: lesson.subgroupNumber,
      specialization: lesson.specialization,
      group: { id: lesson.group.id, name: lesson.group.name },
      replacement: lesson.replacement,
      currentLessonHours: lesson.currentLessonHours,
    });
    setSelectedTeacherId(lesson.teacher.id);
    setActionsModalVisible(true);
  };

  const onAddSeveralLesson = () => {
    if (!selectedLesson || !selectedTimeSlot) return;

    // При кліку на кнопку Додати - очищається раніше вибрана аудиторія щоб уникнути повторного виставлення
    // в одну й ту ж аудиторію при виставленні підгруп
    setSelectedAuditory(null);

    setIsAddNewLesson(true);
    onGetAuditoryOverlay(selectedTimeSlot.data, selectedTimeSlot.lessonNumber, 0);
    setSelectedLesson({
      id: selectedLesson.id,
      name: selectedLesson.name,
      typeRu: selectedLesson.typeRu,
      stream: selectedLesson.stream,
      teacher: selectedLesson.teacher,
      totalHours: selectedLesson.totalHours,
      students: selectedLesson.students,
      subgroupNumber: selectedLesson.subgroupNumber,
      specialization: selectedLesson.specialization,
      group: { id: selectedLesson.group.id, name: selectedLesson.group.name },
      replacement: selectedLesson.replacement,
      currentLessonHours: selectedLesson.currentLessonHours,
    });
    setActionsModalVisible(true);
  };

  const isDisabledAddButton = severalLessonsList.some((l) => {
    const isSame =
      selectedLesson?.group?.id !== undefined &&
      l !== undefined &&
      selectedLesson.group?.id === l.group?.id &&
      selectedLesson.typeRu === l.typeRu &&
      selectedLesson.subgroupNumber === l.subgroupNumber &&
      selectedLesson.stream?.id === l.stream?.id &&
      selectedLesson.name === l.name;
    return isSame;
  });

  useEffect(() => {
    if (!selectedTimeSlot) return;
    const dayName = selectedTimeSlot.data.day() !== 0 ? dayNames[selectedTimeSlot.data.day() - 1] : dayNames[6];
    setDayName(dayName);
  }, [selectedTimeSlot]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-4 gap-0">
        <AlertDialogHeader className="pb-2 px-4">
          <DialogTitle className="!font-normal text-sm">
            {dayName}, {selectedTimeSlot?.data.format("DD MMMM")} ⋅{" "}
            {lessonsTime[selectedTimeSlot ? selectedTimeSlot.lessonNumber - 1 : 0]}
          </DialogTitle>
        </AlertDialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col items-center p-8 pb-4">
          {severalLessonsList.map((l) => {
            const teacherName = l.teacher ? getTeacherFullname(l.teacher, "short") : "";

            return (
              <div
                key={l.id}
                className="border p-2 w-75 hover:bg-accent cursor-pointer"
                onClick={() => onSelectLesson(l)}
                style={{
                  marginBottom: "10px",
                  backgroundColor: settings ? settings.colors[convertColorKeys[l.typeRu]] : "#fff",
                }}
                // style={{ backgroundColor: colors[l.typeRu], marginBottom: '10px' }}
              >
                <p className="time-slot-lesson-name">{l.name}</p>

                <p>
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

          <Button onClick={onAddSeveralLesson} disabled={isDisabledAddButton} variant="outline" className="w-75">
            Додати
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SeveralLessonsModal;
