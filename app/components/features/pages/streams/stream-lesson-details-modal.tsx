import { type FC, type Dispatch, type SetStateAction } from "react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/common/dialog";

type LessonKey = "lectures" | "practical" | "laboratory" | "seminars" | "exams";
function getUnitedLessonsKeys(subject: StreamLessonType): LessonKey[] {
  const keys: LessonKey[] = ["lectures", "practical", "laboratory", "seminars", "exams"];

  return keys.filter((key) => {
    const lesson = subject[key];
    return lesson !== null && lesson.unitedWith.length > 1;
  });
}

interface IStreamLessonDetailsModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedLessonFromDetails: StreamLessonType | null;
  setSelectedLessonFromDetails: Dispatch<SetStateAction<StreamLessonType | null>>;
}

const StreamLessonDetailsModal: FC<IStreamLessonDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedLessonFromDetails,
  setSelectedLessonFromDetails,
}) => {
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setSelectedLessonFromDetails(null);
  };

  if (!selectedLessonFromDetails) return;

  const a = {
    name: "Фармакологія",
    group: {
      id: 2,
      name: "LD9-25-1",
    },
    semester: 1,
    lectures: {
      id: 19,
      hours: 10,
      streamName: "test stream updated",
      unitedWith: [19, 3],
    },
    practical: {
      id: 20,
      hours: 30,
      streamName: "test stream updated",
      unitedWith: [20, 4],
    },
    laboratory: null,
    seminars: null,
    exams: {
      id: 21,
      hours: 2,
      streamName: null,
      unitedWith: [],
    },
  };

  console.log(getUnitedLessonsKeys(selectedLessonFromDetails));

  const { name, group, semester } = selectedLessonFromDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Дисципліни, які об'єднані з вибраною:</DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <div className="pb-4">
            <ul className="">
              <li>
                <span className="font-bold">Дисципліна:</span> {name}
              </li>
              <li>
                <span className="font-bold">Група: </span>
                {group.name}
              </li>
              <li>
                <span className="font-bold">Семестр:</span> {semester}
              </li>
              <li>
                <span className="font-bold">Lesson types:</span> lectures, practical
              </li>
            </ul>

            <p className="font-bold pt-4 pb-2 text-base">Об'єднана з:</p>

            {[...Array(2)].map((el) => (
              <ul className="border-b py-2">
                <li>
                  <span className="font-bold">Дисципліна:</span> {name}
                </li>
                <li>
                  <span className="font-bold">Група: </span>
                  {group.name}
                </li>
                <li>
                  <span className="font-bold">Семестр:</span> {semester}
                </li>
                <li>
                  <span className="font-bold">Lesson types:</span> lectures, practical
                </li>
              </ul>
            ))}
          </div>

          <div className="flex !justify-start pt-2">
            <Button>Закрити</Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default StreamLessonDetailsModal;
