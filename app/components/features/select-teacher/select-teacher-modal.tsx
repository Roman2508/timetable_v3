import { useSelector } from "react-redux";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { SelectTeacherTable } from "./select-teacher-table";
import { Separator } from "~/components/ui/common/separator";
import type { ISelectedLesson } from "~/pages/timetable-page";
import { InputSearch } from "~/components/ui/custom/input-search";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import type { TeachersCategoryType, TeachersType } from "~/store/teachers/teachers-types";
import { scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import { createReplacement, deleteReplacement } from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";

interface ISelectTeacherModal {
  open: boolean;
  isReplacementExist: boolean;
  selectedLessonId: number | null;
  replacementTeacher: TeachersType | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setActionsModalVisible: Dispatch<SetStateAction<boolean>>;
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>;
  setReplacementTeacher: Dispatch<SetStateAction<TeachersType | null>>;
}

const SelectTeacherModal: FC<ISelectTeacherModal> = ({
  open,
  setOpen,
  selectedLessonId,
  setSelectedLesson,
  isReplacementExist,
  replacementTeacher,
  setReplacementTeacher,
  setActionsModalVisible,
}) => {
  const dispatch = useAppDispatch();

  const { teachersCategories } = useSelector(teachersSelector);
  const { teacherOverlay } = useSelector(scheduleLessonsSelector);

  const [freeTeachers, setFreeTeachers] = useState<TeachersCategoryType[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState(replacementTeacher);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setActionsModalVisible(true);
  };

  const checkTeachersOverlay = () => {
    if (teacherOverlay && teacherOverlay.length) {
      const freeTeachers = (teachersCategories || []).map((el) => {
        const teachers = el.teachers.filter((teacher) => !teacherOverlay.some((overlay) => overlay.id === teacher.id));
        return { ...el, teachers };
      });
      setFreeTeachers(freeTeachers);
    }
  };

  // pre confirmation не треба бо зразу при кліку на кнопку "Вибрати" створюється заміна
  const onCreateReplacement = async () => {
    if (!replacementTeacher || !selectedLessonId) return;
    const createReplacementPayload = { lessonId: selectedLessonId, teacherId: replacementTeacher.id };
    const { payload } = await dispatch(createReplacement(createReplacementPayload));
    const data = payload as { id: number; teacher: TeachersType };
    setSelectedLesson((prev) => {
      if (!prev) return null;
      return { ...prev, replacement: data.teacher };
    });

    onOpenChange(false);
  };

  const onDeleteReplacement = async () => {
    if (!selectedLessonId) return;
    if (!window.confirm("Ви дійсно хочете видалити заміну?")) return;

    await dispatch(deleteReplacement(selectedLessonId));
    setSelectedLesson((prev) => {
      if (!prev) return null;
      return { ...prev, replacement: null };
    });
    onOpenChange(false);
  };

  useEffect(() => {
    checkTeachersOverlay();
  }, [teacherOverlay]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть аудиторію:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Виберіть аудиторію, яка буде використовуватись для подальших дій
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <InputSearch className="mb-4 mx-4 mr-6" placeholder="Знайти аудиторію..." />

          <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
            {(freeTeachers ?? []).map((category) => (
              <Collapsible key={category.id} className="pt-2 border mb-4" defaultOpen>
                <div className="flex items-center justify-between pl-4 pb-2 pr-2">
                  <h4 className="text-sm font-semibold">{category.name}</h4>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2">
                  <SelectTeacherTable
                    teachers={category.teachers}
                    selectedTeacher={selectedTeacher}
                    setSelectedTeacher={setSelectedTeacher}
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex items-center pt-2 px-4">
          <Button onClick={onCreateReplacement} disabled={!selectedTeacher}>
            Вибрати
          </Button>

          <Button onClick={onDeleteReplacement} disabled={!isReplacementExist} variant="destructive">
            Видалити заміну
          </Button>

          {selectedTeacher && (
            <div className="flex-1 font-mono mr-3">
              <p className="leading-4">Вибрано викладача:</p>
              <p className="font-bold"> {getTeacherFullname(selectedTeacher)}</p>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTeacherModal;
