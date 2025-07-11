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
import { clearGradeBook } from "~/store/gradeBook/grade-book-slice";
import type { GradeBookType } from "~/store/gradeBook/grade-book-types";
import { getGradeBook, getLessonThemes } from "~/store/gradeBook/grade-book-async-actions";
import { lessonsForGradeBookSelector } from "~/store/schedule-lessons/schedule-lessons-slice";

interface ISelectGradeBookModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setGradeBookLessonDates: Dispatch<SetStateAction<{ date: string }[]>>;
}

const SelectGradeBookModal: FC<ISelectGradeBookModal> = ({ open, setOpen, setGradeBookLessonDates }) => {
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const { lessons } = useSelector(lessonsForGradeBookSelector);
  const lessonsList = useMemo(
    () =>
      lessons.map((el) => {
        const unitInfo = option.subgroupNumber ? `(${option.subgroupNumber} підгрупа)` : "(Вся група)";
        return `${option.typeRu} / ${option.name} ${unitInfo}`;
      }),
    [lessons],
  );

  const { groupCategories } = useSelector(groupsSelector);
  const groupList = useMemo(() => (groupCategories || []).flatMap((el) => el.groups), [groupCategories]);

  const [userFormData, setUserFormData] = useState({});
  const [selectedLessonType, setSelectedLessonType] = useState<null | string>(null);

  const formData = {
    groupId: searchParams.get("groupId"),
    semester: searchParams.get("semester"),
    lessonId: searchParams.get("lessonId"),
    ...userFormData,
  };

  const fetchGradeBook = async (groupId: number, lessonId: number, semester: number, lessonType: string) => {
    const { payload } = await dispatch(
      getGradeBook({
        group: groupId,
        lesson: lessonId,
        semester: semester,
        // @ts-ignore
        type: lessonType,
      }),
    );

    const selectedGroup = groupList.find((el) => el.id === groupId);

    if (selectedGroup) {
      // Треба знайти рік вступу групи і до нього додавати курс навчання
      alert("Треба знайти рік вступу групи і до нього додавати курс навчання");
      dispatch(getLessonThemes({ id: lessonId, year: selectedGroup.yearOfAdmission + selectedGroup.courseNumber }));
    }

    const gradeBook = payload as GradeBookType;

    const findLessonsPayload: any = {
      semester,
      groupId: gradeBook.group.id,
      type: gradeBook.lesson.typeRu,
      lessonName: gradeBook.lesson.name,
    };

    const stream = gradeBook.lesson.stream ? gradeBook.lesson.stream.id : null;
    const specialization = gradeBook.lesson.specialization ? gradeBook.lesson.specialization : null;
    const subgroupNumber = gradeBook.lesson.subgroupNumber ? gradeBook.lesson.subgroupNumber : null;

    if (stream) findLessonsPayload.stream = stream;
    if (specialization) findLessonsPayload.specialization = specialization;
    if (subgroupNumber) findLessonsPayload.subgroupNumber = subgroupNumber;

    const dates = await scheduleLessonsAPI.findAllLessonDatesForTheSemester(findLessonsPayload);

    const sortedDates = sortItemsByKey(dates.data, "date");
    setGradeBookLessonDates(sortedDates);
  };

  const onSubmit = async () => {
    try {
      if (!selectedLessonType) return alert("Виберіть дисципліну");
      //   handleClose()

      const { groupId, lessonId, semester } = formData;

      setSearchParams({
        groupId: String(groupId),
        lessonId: String(lessonId),
        semester: String(semester),
        lessonType: selectedLessonType,
      });
      dispatch(clearGradeBook());
      await fetchGradeBook(Number(groupId), Number(lessonId), Number(semester), selectedLessonType);
    } catch (error) {
      console.log(error);
    }
  };

  //   React.useEffect(() => {
  //     if (groups.length) return
  //     dispatch(getGroupCategories(false))
  //   }, [])

  //   React.useEffect(() => {
  //     if (!watch('semester') || !watch('group')) return
  //     dispatch(findLessonsForSchedule({ semester: watch('semester'), itemId: watch('group'), scheduleType: 'group' }))
  //   }, [watch('group'), watch('semester')])

  //   React.useEffect(() => {
  //     if (!watch('lesson')) return
  //     const findedLesson = lessons.find((el) => el.id === Number(watch('lesson')))
  //     if (findedLesson) setSelectedLessonType(findedLesson.typeRu)
  //   }, [watch('lesson')])

  //   React.useEffect(() => {
  //     const groupId = searchParams.get('groupId')
  //     const lessonId = searchParams.get('lessonId')
  //     const semester = searchParams.get('semester')

  //     if (!groupId || !lessonId || !semester) return

  //     setValue('group', Number(groupId))
  //     setValue('lesson', lessonId)
  //     setValue('semester', Number(semester))
  //   }, [searchParams])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 max-w-[450px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Електронний журнал:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">Вкажіть критерії для пошуку електронного журналу</p>
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
              onChange={(lessonId) => setUserFormData((prev) => ({ ...prev, lessonId }))}
            />

            {/* 
            {lessons.map((option) => {
                      const unitInfo = option.subgroupNumber ? `(${option.subgroupNumber} підгрупа)` : '(Вся група)'

                      return (
                        <MenuItem key={option.id} value={option.id}>
                          {`${option.typeRu} / ${option.name} ${unitInfo}`}
                        </MenuItem>
                      )
                    })}
            */}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button>Вибрати</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectGradeBookModal;
