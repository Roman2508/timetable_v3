import {
  Clock as ClockIcon,
  UserRound as UserIcon,
  MapPin as LocationIcon,
  UsersRound as UsersIcon,
  RefreshCw as ReplacementIcon,
} from "lucide-react";
import { type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { ISelectedLesson } from "~/pages/timetable-page";
import type { ISelectedTimeSlot } from "./timetable-calendar";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";

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
  selectedAuditoryName: string;
  selectedAuditoryId: number | null;
  selectedLesson: ISelectedLesson | null;
  selectedTimeSlot: ISelectedTimeSlot | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddNewLesson: Dispatch<SetStateAction<boolean>>;
  setSelectedAuditoryName: Dispatch<SetStateAction<string>>;
  setTeacherModalVisible: Dispatch<SetStateAction<boolean>>;
  setAuditoryModalVisible: Dispatch<SetStateAction<boolean>>;
  setSeveralLessonsModalVisible: Dispatch<SetStateAction<boolean>>;
  setSeveralLessonsList: Dispatch<SetStateAction<ScheduleLessonType[]>>;
}

const LessonActionsModal: FC<ILessonActionsModalProps> = ({
  open,
  setOpen,
  isRemote,
  isAddNewLesson,
  selectedLesson,
  selectedTimeSlot,
  selectedSemester,
  setIsAddNewLesson,
  currentWeekNumber,
  selectedAuditoryId,
  selectedAuditoryName,
  setSeveralLessonsList,
  setTeacherModalVisible,
  setAuditoryModalVisible,
  setSelectedAuditoryName,
  setSeveralLessonsModalVisible,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-4 gap-0">
        <DialogHeader className="pb-2 px-4">
          <DialogTitle className="!font-normal text-sm">Тиждень: 1</DialogTitle>

          <h3 className="text-xl font-medium">Фармакологія (ЛК) - Група PH9-25-1</h3>
          <h3 className="text-xl font-medium leading-4">Потік: test stream updated</h3>
          <p className="mt-1">Середа, 04 вересня ⋅ 08:30 - 09:50</p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col mb-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <ReplacementIcon width={18} />
            <div className="">Зробити заміну</div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <LocationIcon width={18} />
            <div className="">Аудиторія: не вибрана</div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <ClockIcon width={18} />
            <div className="">Кількість годин: 2</div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <UsersIcon width={18} />
            <div className="">Викладач: Пташник Р.В.</div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer hover:bg-sidebar">
            <UserIcon width={18} />
            <div className="">Студентів: -</div>
          </div>
        </DialogDescription>

        <DialogFooter className="px-4">
          <Button className="" variant="destructive">
            Видалити
          </Button>

          {true ? <Button className="">Зберегти</Button> : <Button className="">Оновити</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonActionsModal;
