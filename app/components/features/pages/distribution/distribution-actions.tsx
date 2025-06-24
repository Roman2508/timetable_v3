import { ChevronLeft, CircleX, CopyPlus, CopyX, SquarePlus, X as CloseIcon } from "lucide-react";
import { useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import type { GroupLoadType } from "~/store/groups/groups-types";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import type { TeachersType } from "~/store/teachers/teachers-types";
import { changeAlertModalStatus } from "~/store/general/general-slice";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import type { DistributionLessonType } from "~/helpers/get-lesson-for-distribution";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { attachTeacher, unpinTeacher } from "~/store/schedule-lessons/schedule-lessons-async-actions";

export type AttachmentTypes = "attach_one" | "attach_all" | "unpin_one" | "unpin_all";

const distributionVariants = [
  {
    icon: <CopyX />,
    tooltip: "Відкріпити всі",
    name: "unpin_all",
  },
  {
    icon: <CircleX />,
    tooltip: "Відкріпити одного",
    name: "unpin_one",
  },
  {
    icon: <CopyPlus />,
    tooltip: "Прикріпити всі",
    name: "attach_all",
  },
  {
    icon: <SquarePlus />,
    tooltip: "Прикріпити одного",
    name: "attach_one",
  },
] as const;

export const sortLessonsByLessonType = (distributionLessons: DistributionLessonType | null): GroupLoadType[] => {
  if (!distributionLessons) return [];
  const selectedLesson = distributionLessons.lessonTypes;
  const sortOrder = ["ЛК", "ПЗ", "ЛАБ", "СЕМ", "ЕКЗ", "КОНС", "МЕТОД"];
  const lessonsCopy = JSON.parse(JSON.stringify(selectedLesson));

  lessonsCopy.sort((a: GroupLoadType, b: GroupLoadType) => {
    return sortOrder.indexOf(a.typeRu) - sortOrder.indexOf(b.typeRu);
  });

  return lessonsCopy;
};

interface IDistributionActionsProps {
  selectedTeacherId: number | null;
  selectedLesson: DistributionLessonType | null;
  setSelectedLesson: Dispatch<SetStateAction<DistributionLessonType | null>>;
}

const DistributionActions: FC<IDistributionActionsProps> = ({
  selectedLesson,
  setSelectedLesson,
  selectedTeacherId,
}) => {
  const dispatch = useAppDispatch();

  const orderedLessons = useMemo(() => sortLessonsByLessonType(selectedLesson), [selectedLesson]);

  const [isDisabled, setIsDisabled] = useState(false);
  const [attachmentType, setAttachmentType] = useState<AttachmentTypes>("attach_one");

  const onAttachTeacher = async (lessonId: number) => {
    if (!selectedTeacherId) return alert("Виберіть викладача");
    const { payload } = await dispatch(attachTeacher({ lessonId, teacherId: selectedTeacherId }));
    const data = payload as { lessonId: number; teacher: TeachersType };
    setSelectedLesson((prev) => {
      if (prev) {
        const lessonTypes = prev.lessonTypes.map((lesson) => {
          if (lesson.id === data.lessonId) return { ...lesson, teacher: data.teacher };
          return lesson;
        });

        return { ...prev, lessonTypes };
      }

      return prev;
    });
  };

  const onUnpinTeacher = async (lessonId: number) => {
    const { payload } = await dispatch(unpinTeacher(lessonId));
    const data = payload as { lessonId: number };
    setSelectedLesson((prev) => {
      if (prev) {
        const lessonTypes = prev.lessonTypes.map((lesson) => {
          if (lesson.id === data.lessonId) return { ...lesson, teacher: null };
          return lesson;
        });
        return { ...prev, lessonTypes };
      }

      return prev;
    });
  };

  const onClickActionButton = async (lessonId: number) => {
    if (!selectedTeacherId) {
      const alertPayload = {
        isOpen: true,
        title: "Помилка",
        text: "Викладач для закріплення за дисципліною не вибраний",
      };
      dispatch(changeAlertModalStatus(alertPayload));
      return;
    }

    try {
      setIsDisabled(true);
      if (attachmentType === "attach_one") {
        await onAttachTeacher(lessonId);
        return;
      }
      if (attachmentType === "unpin_one") {
        await onUnpinTeacher(lessonId);
        return;
      }
      if (!selectedLesson) return;

      if (attachmentType === "attach_all") {
        await Promise.all(selectedLesson.lessonTypes.map(async (el) => await onAttachTeacher(el.id)));
        return;
      }
      if (attachmentType === "unpin_all") {
        await Promise.all(selectedLesson.lessonTypes.map(async (el) => await onUnpinTeacher(el.id)));
      }
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      <h3 className="text-md font-semibold text-center pb-3">
        {selectedLesson ? selectedLesson.name : "Виберіть дисципліну"}
      </h3>

      <div className="flex gap-2 justify-center mb-8 py-2 border-y">
        <Tabs defaultValue="attach_one">
          <TabsList>
            {distributionVariants.map((el) => (
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <TabsTrigger
                    key={el.name}
                    value={el.name}
                    className="px-3 py-2"
                    disabled={!selectedLesson}
                    onClick={() => setAttachmentType(el.name)}
                  >
                    {el.icon}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>{el.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="">
        {orderedLessons &&
          orderedLessons.map((lesson) => {
            const stream = lesson.stream ? `${lesson.stream.name} ` : "";
            const streamGroups = lesson.stream ? lesson.stream.groups.map((el) => el.name).join(", ") : "";

            const subgroup = lesson.subgroupNumber ? `підгр. ${lesson.subgroupNumber} ` : "";
            const specialization = lesson.specialization ? `${lesson.specialization} спец. ` : "";

            const remark = (stream || specialization || subgroup) && `(${stream}${specialization}${subgroup})`;
            const tooltipRemark =
              (stream || specialization || subgroup) &&
              `(${specialization}${subgroup}Потік: ${stream} Групи потоку: ${streamGroups})`;

            const teacherFull = lesson.teacher ? getTeacherFullname(lesson.teacher, "full") : "";
            const teacherInitials = lesson.teacher ? getTeacherFullname(lesson.teacher, "short") : "";

            return (
              <div className="flex justify-between items-center gap-4 mb-4">
                <Tooltip delayDuration={500}>
                  <TooltipTrigger>
                    <p className="w-30 text-left text-sm truncate">
                      {lesson.typeRu} {remark}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {lesson.typeRu} {tooltipRemark}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={500}>
                  <TooltipTrigger>
                    <Input className="cursor-default" readOnly value={teacherInitials} />
                  </TooltipTrigger>
                  <TooltipContent>{teacherFull}</TooltipContent>
                </Tooltip>

                <Input className="max-w-13 cursor-default" readOnly value={lesson.hours} />
                <Button variant="outline" onClick={() => onClickActionButton(lesson.id)} disabled={isDisabled}>
                  {attachmentType.includes("attach") ? <ChevronLeft /> : <CloseIcon />}
                </Button>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default DistributionActions;
