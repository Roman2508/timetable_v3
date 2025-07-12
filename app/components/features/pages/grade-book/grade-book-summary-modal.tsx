import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { useEffect, useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { SEMESTERS_LIST } from "~/constants";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { groupsSelector } from "~/store/groups/groups-slice";
import { Separator } from "~/components/ui/common/separator";
import { sortItemsByKey } from "~/helpers/sort-items-by-key";
import { scheduleLessonsAPI } from "~/api/schedule-lessons-api";
import DropdownSelect from "~/components/ui/custom/dropdown-select";
import { clearGradeBook, deleteSummaryGradesLocally, gradeBookSelector } from "~/store/gradeBook/grade-book-slice";
import type { GradeBookSummaryType, GradeBookType } from "~/store/gradeBook/grade-book-types";
import { addSummary, deleteSummary, getGradeBook, getLessonThemes } from "~/store/gradeBook/grade-book-async-actions";
import { lessonsForGradeBookSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import { findLessonsForSchedule } from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { CircleX, CopyX } from "lucide-react";

interface IGradeBookFilterFields {
  type: (typeof summaryTypes)[number]["value"];
  afterLesson: number;
}

const lessonsTabs = [
  { label: "Створити", name: "one" },
  { label: "Видалити", name: "all" },
] as const;

export const summaryTypes = [
  { label: "Тематична оцінка (ср.знач.)", value: "MODULE_AVERAGE" },
  { label: "Рейтинг з модуля (сума)", value: "MODULE_SUM" },
  { label: "Семестрова оцінка (ср.знач.)", value: "LESSON_AVERAGE" },
  { label: "Рейтинг з дисципліни (сума)", value: "LESSON_SUM" },
  { label: "Модульний контроль", value: "MODULE_TEST" },
  { label: "Додатковий рейтинг", value: "ADDITIONAL_RATE" },
  { label: "Поточний рейтинг", value: "CURRENT_RATE" },
  { label: "Екзамен", value: "EXAM" },
] as const;

interface IGradeBookSummaryModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const GradeBookSummaryModal: FC<IGradeBookSummaryModal> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();

  const { gradeBook } = useSelector(gradeBookSelector);

  const [summaryType, setSummaryType] = useState<"add" | "delete">("add");

  const summarySortedList = sortItemsByKey(gradeBook ? gradeBook.summary : [], "afterLesson");
  //   const summarySortedList = JSON.parse(JSON.stringify(gradeBook ? gradeBook.summary : [])).sort(
  //     (a: GradeBookSummaryType, b: GradeBookSummaryType) => {
  //       if (a.afterLesson < b.afterLesson) return -1;
  //       if (a.afterLesson > b.afterLesson) return 1;
  //       return 0;
  //     },
  //   );

  const handleChangeSummaryType = (_: React.SyntheticEvent, newValue: "add" | "delete") => {
    setSummaryType(newValue);
  };

  const onSubmit = async (data) => {
    try {
      if (!gradeBook) return;

      if (data.type === "LESSON_AVERAGE" || data.type === "LESSON_SUM" || data.type === "EXAM") {
        await dispatch(addSummary({ id: gradeBook.id, type: data.type, afterLesson: gradeBook.lesson.hours }));
        return;
      } else {
        await dispatch(addSummary({ id: gradeBook.id, ...data }));
      }

      setOpen(false);
      //   reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteSummary = async (type: (typeof summaryTypes)[number]["value"], afterLesson: number) => {
    try {
      if (!gradeBook) return;
      if (window.confirm("Ви дійсно хочете видалити підсумок?")) {
        // delete summary
        await dispatch(deleteSummary({ id: gradeBook.id, type, afterLesson }));
        // delete all summary grades
        dispatch(deleteSummaryGradesLocally({ id: gradeBook.id, type, afterLesson }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 pb-4 max-w-[450px] gap-0">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Підсумки:</DialogTitle>
          {/* <p className="leading-[1.25] opacity-[.6]">Вкажіть критерії для пошуку електронного журналу</p> */}
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <Tabs
            defaultValue="all"
            className="w-full"
            // onValueChange={(value) => setDividingType(value as "all" | "one")}
          >
            <TabsList className="w-full">
              {lessonsTabs.map((el) => (
                <TabsTrigger
                  key={el.name}
                  value={el.name}
                  className="h-[40px] w-full flex-1"
                  //   disabled={!lessons.length}
                >
                  {el.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-4 pb-0">1</div>
          </Tabs>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-4 px-4">
          <Button>Вибрати</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GradeBookSummaryModal;
