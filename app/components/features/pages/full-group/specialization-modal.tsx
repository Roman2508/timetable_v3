import React from "react";
import { useSelector } from "react-redux";

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
import { plansSelector } from "~/store/plans/plans-slice";
import { Separator } from "~/components/ui/common/separator";
import { InputSearch } from "~/components/ui/custom/input-search";

interface ISpecializationModalProps {
  isOpen: boolean;
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>;
}

const MODAL_NAME = "specialization";

const SpecializationModal: React.FC<ISpecializationModalProps> = ({ isOpen, setOpenedModalName }) => {
  const dispatch = useAppDispatch();

  const { plansCategories } = useSelector(plansSelector);

  const [searchValue, setSearchValue] = React.useState("");

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть навчальний план:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Виберіть навчальний план, який буде використовуватись для формування навантаження групи
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          {plansCategories?.length ? (
            <>
              <InputSearch
                value={searchValue}
                className="mb-4 mx-4 mr-6"
                placeholder="Знайти навчальний план..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </>
          ) : (
            <div className="px-4 py-4">
              <h4 className="text-lg font-semibold">Навчальні плани ще не створено.</h4>
              <p className="text-base leading-[1.25] opacity-[.6]">
                Щоб призначити навантаження групі, спочатку створіть хоча б один навчальний план. Перейдіть до розділу
                «Навчальні плани» та натисніть «Створити план».
              </p>
            </div>
          )}
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button>Зберегти</Button>

          <div className="font-mono mr-3 text-right flex flex-col">123312312</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationModal;
