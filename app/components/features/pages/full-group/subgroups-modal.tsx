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
import { onConfirm } from "../../confirm-modal";
import { SubgroupsTable } from "./subgroups-table";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import { Separator } from "~/components/ui/common/separator";
import type { GroupLoadType } from "~/store/groups/groups-types";
import { InputSearch } from "~/components/ui/custom/input-search";
import type { SubgroupsLessonsType } from "~/helpers/group-lesson-by-name-subgroups-and-semester";

interface ISubgroupsModalProps {
  isOpen: boolean;
  groupLoad: GroupLoadType[] | null;
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>;
}

const MODAL_NAME = "subgroups";

const SubgroupsModal: React.FC<ISubgroupsModalProps> = ({ isOpen, groupLoad, setOpenedModalName }) => {
  const dispatch = useAppDispatch();

  const { plansCategories } = useSelector(plansSelector);

  const [globalSearch, setGlobalSearch] = React.useState("");
  const [selectedLesson, setSelectedLesson] = React.useState<SubgroupsLessonsType | null>(null);

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[1100px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="pb-4">Підгрупи:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Ви можете встановити кількість підгруп, на які будуть поділятись дисципліни
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="px-4 min-h-[50vh] max-h-[60vh] overflow-auto">
          {plansCategories?.length ? (
            <>
              <InputSearch
                value={globalSearch}
                className="my-4"
                placeholder="Знайти дисципліну..."
                onChange={(e) => setGlobalSearch(e.target.value)}
              />

              <SubgroupsTable
                globalSearch={globalSearch}
                selectedLesson={selectedLesson}
                setGlobalSearch={setGlobalSearch}
                setSelectedLesson={setSelectedLesson}
                groupLoad={groupLoad ? groupLoad : []}
              />
            </>
          ) : (
            <div className="py-4">
              <h4 className="text-lg font-semibold">Навчальні плани ще не створено.</h4>
              <p className="text-base leading-[1.25] opacity-[.6]">
                Щоб призначити навантаження групі, спочатку створіть хоча б один навчальний план. Перейдіть до розділу
                «Навчальні плани» та натисніть «Створити план».
              </p>
            </div>
          )}
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center px-4 mt-6">
          <Button>Закрити</Button>

          <div className="font-mono mr-3 text-right flex flex-col"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubgroupsModal;
