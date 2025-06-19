import { type Dispatch, type FC, type SetStateAction } from "react";

import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/common/dialog";
import { Checkbox } from "~/components/ui/common/checkbox";

interface ICombineStreamLessonsModalProps {
  isOpen: boolean;
  selectedLessons: StreamLessonType[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CombineStreamLessonsModal: FC<ICombineStreamLessonsModalProps> = ({ isOpen, setIsOpen, selectedLessons }) => {
  const handleSubmit = () => {};

  const formData = {
    name: "",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[360px]">
        <DialogHeader>
          <DialogTitle>Об'єднати дисципліни в потік</DialogTitle>
          <p className="text-muted-foreground pb-2 text-sm">
            Виберіть всі типи занятть, які будуть вивчатись одночасно
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col">
              {["Лекції", "Практичні", "Лабораторні", "Семінари", "Екзамен"].map((el) => (
                <div className="h-10">
                  <label key={el} className="text-base inline-flex items-center gap-2 cursor-pointer">
                    <Checkbox />
                    <span className="select-none">{el}</span>
                  </label>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={false}>Зберегти</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CombineStreamLessonsModal;
