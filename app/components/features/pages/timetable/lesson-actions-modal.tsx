import {
  Clock as ClockIcon,
  UserRound as UserIcon,
  MapPin as LocationIcon,
  UsersRound as UsersIcon,
  RefreshCw as ReplacementIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import {
  createScheduleLesson,
  deleteScheduleLesson,
  updateScheduleLesson,
} from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { ISelectedLesson } from "~/pages/timetable-page";
import type { ISelectedTimeSlot } from "./timetable-calendar";
import LoadingSpinner from "~/components/ui/icons/loading-spinner";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";
import { deleteTeacherOverlay, scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import type { TeachersType } from "~/store/teachers/teachers-types";

const DAY_NAMES = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

const LESSONS_TIME = [
  "08:30 – 09:50",
  "10:00 – 11:20",
  "12:00 – 13:20",
  "13:30 – 14:50",
  "15:00 – 16:20",
  "16:30 – 17:50",
  "18:00 – 19:20",
];

interface ILessonActionsModalProps {
  open: boolean;
  isRemote: boolean;
  isAddNewLesson: boolean;
  selectedSemester: 1 | 2;
  currentWeekNumber: number;
  selectedLesson: ISelectedLesson | null;
  selectedAuditory: AuditoriesTypes | null;
  selectedTimeSlot: ISelectedTimeSlot | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddNewLesson: Dispatch<SetStateAction<boolean>>;
  setTeacherModalVisible: Dispatch<SetStateAction<boolean>>;
  setAuditoryModalVisible: Dispatch<SetStateAction<boolean>>;
  setSeveralLessonsModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedAuditory: Dispatch<SetStateAction<AuditoriesTypes | null>>;
  setSeveralLessonsList: Dispatch<SetStateAction<ScheduleLessonType[]>>;
}

const LessonActionsModal: FC<ILessonActionsModalProps> = ({
  open,
  setOpen,
  isRemote,
  isAddNewLesson,
  selectedLesson,
  selectedAuditory,
  selectedTimeSlot,
  selectedSemester,
  setIsAddNewLesson,
  currentWeekNumber,
  setSelectedAuditory,
  setSeveralLessonsList,
  setTeacherModalVisible,
  setAuditoryModalVisible,
  setSeveralLessonsModalVisible,
}) => {
  const dispatch = useAppDispatch();

  const { auditoriCategories } = useSelector(auditoriesSelector);
  const { auditoryOverlay, teacherOverlay, groupLoad } = useSelector(scheduleLessonsSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);
  const [currentLessonHours, setCurrentLessonHours] = useState(2);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!auditoriCategories) return;
    const auditory = auditoriCategories.flatMap((el) => el.auditories).find((el) => el.id === selectedAuditory?.id);
    if (auditory) setSelectedAuditory(auditory);
  }, [selectedAuditory, auditoriCategories]);

  useEffect(() => {
    if (!selectedLesson) return;
    setCurrentLessonHours(selectedLesson.currentLessonHours);
  }, [selectedLesson]);

  useEffect(() => {
    if (!selectedLesson || !groupLoad) return;

    const selectedGroupLoadLesson = groupLoad.find((el) => {
      return (
        el.name === selectedLesson.name &&
        el.group.id === selectedLesson.group.id &&
        el.stream?.id === selectedLesson.stream?.id &&
        el.subgroupNumber === selectedLesson.subgroupNumber &&
        el.typeRu === selectedLesson.typeRu &&
        el.specialization === selectedLesson.specialization &&
        el.hours === selectedLesson.totalHours
      );
    });

    if (selectedGroupLoadLesson) {
      setStudentsCount(selectedGroupLoadLesson.students.length);
    }
  }, [selectedLesson, groupLoad]);

  if (!selectedLesson || !selectedTimeSlot) return;

  const dayName = selectedTimeSlot.data.day() !== 0 ? DAY_NAMES[selectedTimeSlot.data.day() - 1] : DAY_NAMES[6];

  const onCreateScheduleLesson = async () => {
    try {
      setIsLoading(true);

      if (!selectedAuditory && !isRemote) {
        alert("Аудиторія не вибрана");
        return;
      }

      if (selectedLesson.typeRu === "МЕТОД") return;

      const date = selectedTimeSlot.data.format("YYYY-MM-DD");
      const stream = selectedLesson.stream ? selectedLesson.stream.id : null;

      const payload = {
        date,
        stream,
        isRemote,
        currentLessonHours,
        id: selectedLesson.id,
        semester: selectedSemester,
        name: selectedLesson.name,
        typeRu: selectedLesson.typeRu,
        group: selectedLesson.group.id,
        hours: selectedLesson.totalHours,
        students: selectedLesson.students,
        teacher: selectedLesson.teacher.id,
        lessonNumber: selectedTimeSlot.lessonNumber,
        specialization: selectedLesson.specialization,
        subgroupNumber: selectedLesson.subgroupNumber,
        auditory: selectedAuditory ? selectedAuditory.id : null,
      };
      const data = await dispatch(createScheduleLesson(payload));
      setOpen(false);
      const lesson = data.payload as ScheduleLessonType;
      if (lesson) {
        setSeveralLessonsList((prev) => [...prev, lesson]);
      }
      setIsAddNewLesson(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateLesson = async () => {
    try {
      setIsLoading(true);
      if (!auditoriCategories) return;
      if (!selectedAuditory && !isRemote) return alert("Error");

      let lesson = {} as ScheduleLessonType;

      if (!selectedAuditory) {
        const { payload } = await dispatch(
          updateScheduleLesson({
            id: selectedLesson.id,
            currentLessonHours,
            auditoryId: null,
            isRemote,
          }),
        );

        lesson = payload as ScheduleLessonType;
        //
      } else {
        let seatsNumber;
        let auditoryName;

        auditoriCategories.forEach((category) => {
          const auditory = category.auditories.find((a) => a.id === selectedAuditory.id);

          if (auditory) {
            seatsNumber = auditory.seatsNumber;
            auditoryName = auditory.name;
          }
        });

        if (!seatsNumber || !auditoryName) {
          return alert("Error");
        }

        const { payload } = await dispatch(
          updateScheduleLesson({
            isRemote,
            seatsNumber,
            auditoryName,
            currentLessonHours,
            id: selectedLesson.id,
            auditoryId: selectedAuditory.id,
          }),
        );

        if (!payload) return alert("Error");

        lesson = payload as ScheduleLessonType;
      }

      setSeveralLessonsList((prev) => {
        const lessons = prev.map((el) => {
          if (el.id === lesson.id) {
            return { ...el, ...lesson };
          }

          return el;
        });

        return lessons;
      });

      setSeveralLessonsModalVisible(false);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteLesson = async (id: number) => {
    try {
      if (!window.confirm("Ви дійсно хочете видалити ел. розкладу?")) return;
      setIsLoading(true);
      const { payload } = await dispatch(deleteScheduleLesson(id));
      const deletedItemId = payload as number;
      dispatch(deleteTeacherOverlay(deletedItemId));
      handleClose();
      setIsAddNewLesson(false);

      setSeveralLessonsList((prev) => {
        const lessons = prev.filter((el) => el.id !== deletedItemId);
        if (!lessons.length) {
          setSeveralLessonsModalVisible(false);
        }
        return lessons;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setIsAddNewLesson(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 py-4 gap-0" forceMount autoFocus={false}>
        <DialogHeader className="pb-2 px-4">
          <DialogTitle className="!font-normal text-sm">Тиждень: {currentWeekNumber}</DialogTitle>

          <div className="pt-4 flex flex-col gap-3">
            <h3 className="text-xl font-medium leading-0">
              {selectedLesson.name} ({selectedLesson.typeRu}) - Група {selectedLesson.group.name}
            </h3>
            <h3 className="text-xl font-medium">
              {selectedLesson.subgroupNumber ? `. ${selectedLesson.subgroupNumber} підгрупа` : ""}{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                {selectedLesson.stream ? `Потік: ${selectedLesson.stream.name}` : ""}
              </span>
            </h3>
          </div>

          <p className="mt-1">
            {dayName}, {selectedTimeSlot.data.format("DD MMMM")} ⋅ {LESSONS_TIME[selectedTimeSlot.lessonNumber - 1]}
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col mb-4">
          {/* Заміна */}
          {!isAddNewLesson && (
            <div
              onClick={() => {
                if (teacherOverlay) setTeacherModalVisible(true);
              }}
              className={cn(
                !teacherOverlay ? "opacity-[0.5] !cursor-default" : "",
                "flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar",
              )}
            >
              <ReplacementIcon width={18} />
              <div className="flex gap-2">
                {!teacherOverlay ? (
                  <>
                    Зробити заміну
                    <LoadingSpinner size={20} />
                  </>
                ) : (
                  `${
                    selectedLesson.replacement
                      ? `Заміна! ${getTeacherFullname(selectedLesson.replacement, "short")}`
                      : "Зробити заміну"
                  }`
                )}
              </div>
            </div>
          )}

          {/* Аудиторія */}
          <div
            className={cn(
              !auditoryOverlay ? "opacity-[0.5] !cursor-default" : "",
              "flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar",
            )}
            onClick={() => {
              if (auditoryOverlay) {
                handleClose();
                setAuditoryModalVisible(true);
              }
            }}
          >
            <LocationIcon width={18} />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!auditoryOverlay ? (
                <>
                  Аудиторія:
                  <LoadingSpinner size={20} />
                </>
              ) : (
                `Аудиторія: ${selectedAuditory ? selectedAuditory.name : isRemote ? "Дистанційно" : "не вибрана"}`
              )}
            </div>
          </div>

          {/* Кількість годин */}
          <div className="flex items-center gap-2 px-4 py-3 border-b hover:bg-sidebar">
            <ClockIcon width={18} />
            <div className="flex items-center gap-1">
              <span>Кількість годин:</span>
              <Input
                min={1}
                max={2}
                type="number"
                tabIndex={-1}
                value={currentLessonHours}
                onChange={(e) => setCurrentLessonHours(Number(e.target.value))}
                className="!border-0 bg-transparent w-[40px] h-[20px] !p-0 !outline-none !shadow-none"
              />
            </div>
          </div>

          {/* Викладач */}
          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <UsersIcon width={18} />
            <div>{`Викладач: ${getTeacherFullname(selectedLesson.teacher, "short")}`}</div>
          </div>

          {/* Студентів */}
          <div className="flex items-center gap-2 px-4 py-3 border-b hover:bg-sidebar">
            <UserIcon width={18} />
            <div>{`Студентів: ${studentsCount ? studentsCount : "-"}`}</div>
          </div>
        </DialogDescription>

        <DialogFooter className="px-4">
          {!isAddNewLesson && (
            <Button variant="destructive" onClick={() => onDeleteLesson(selectedLesson.id)} disabled={isLoading}>
              Видалити
            </Button>
          )}

          {isAddNewLesson ? (
            <Button onClick={onCreateScheduleLesson} disabled={isLoading}>
              Зберегти
            </Button>
          ) : (
            <Button onClick={onUpdateLesson} disabled={isLoading}>
              Оновити
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonActionsModal;
