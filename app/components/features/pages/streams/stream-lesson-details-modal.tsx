import { useSelector } from "react-redux";
import { type FC, type Dispatch, type SetStateAction, useMemo } from "react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { streamsSelector } from "~/store/streams/streams-slice";
import type { StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { getCombinedStreamLessons } from "~/helpers/get-combined-stream-lessons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/common/dialog";

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
  const { streamLessons } = useSelector(streamsSelector);

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setSelectedLessonFromDetails(null);
  };

  const combinedLessons = useMemo(
    () => getCombinedStreamLessons(selectedLessonFromDetails, streamLessons),
    [selectedLessonFromDetails, streamLessons],
  );

  if (!selectedLessonFromDetails) return;
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
            </ul>

            <p className="font-bold pt-4 pb-2 text-base">Об'єднана з:</p>

            {combinedLessons && combinedLessons.length ? (
              combinedLessons.map((el) => (
                <ul className="border-b py-2">
                  <li>
                    <span className="font-bold">Дисципліна:</span> {el.name}
                  </li>
                  <li>
                    <span className="font-bold">Група: </span>
                    {el.group}
                  </li>
                  <li>
                    <span className="font-bold">Семестр:</span> {el.semester}
                  </li>
                  <li>
                    <span className="font-bold">Види занять:</span> {el.lessonTypes.join(", ")}
                  </li>
                </ul>
              ))
            ) : (
              <p className="pt-4 text-center font-bold text-base">Дисципліна ще не об'єднана в потік</p>
            )}
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
