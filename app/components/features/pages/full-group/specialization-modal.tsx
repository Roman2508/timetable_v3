import React from "react";
import { useSelector } from "react-redux";
import { Check, Pencil, Trash, X } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import { Separator } from "~/components/ui/common/separator";
import { SpecializationTable } from "./specialization-table";
import type { GroupLoadType } from "~/store/groups/groups-types";
import { InputSearch } from "~/components/ui/custom/input-search";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { createSpecialization, deleteSpecialization, updateSpecialization } from "~/store/groups/groups-async-actions";
import { groupsSelector } from "~/store/groups/groups-slice";

interface ISpecializationModalProps {
  isOpen: boolean;
  groupId: string;
  specializationList: string[];
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>;
}

const MODAL_NAME = "specialities";

const SpecializationModal: React.FC<ISpecializationModalProps> = ({
  isOpen,
  groupId,
  specializationList,
  setOpenedModalName,
}) => {
  const dispatch = useAppDispatch();

  const {
    group: { groupLoad },
  } = useSelector(groupsSelector);
  const { plansCategories } = useSelector(plansSelector);

  const [globalSearch, setGlobalSearch] = React.useState("");

  const [specName, setSpecName] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [oldSpecName, setOldSpecName] = React.useState("");
  const [specActionType, setSpecActionType] = React.useState<"create" | "update">("create");

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME));
  };

  const onClickEdit = (name: string) => {
    setSpecActionType("update");
    setOldSpecName(name);
    setSpecName(name);
  };

  const onClickCancelEdit = () => {
    setSpecActionType("create");
    setOldSpecName("");
    setSpecName("");
  };

  const onChangeSpecName = async () => {
    try {
      if (!groupId) return;
      setIsPending(true);
      if (specActionType === "create") {
        await dispatch(createSpecialization({ name: specName, groupId: Number(groupId) }));
      } else {
        await dispatch(updateSpecialization({ newName: specName, oldName: oldSpecName, groupId: Number(groupId) }));
      }
      setOldSpecName("");
      setSpecName("");
    } finally {
      setIsPending(false);
    }
  };

  const onDeleteSpecGroup = async (name: string) => {
    try {
      if (window.confirm("Ви дійсно хочете видалити спец. підгрупу")) {
        setIsPending(true);
        await dispatch(deleteSpecialization({ groupId: Number(groupId), name }));
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[1100px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="pb-4">Спеціалізовані підгрупи:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Ви можете встановити спеціалізовані підгрупи за вибірковими дисциплінами
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="px-4 min-h-[50vh] max-h-[60vh] overflow-auto">
          {plansCategories?.length ? (
            <>
              <div className="flex gap-2 my-4">
                <InputSearch
                  className="w-full"
                  value={globalSearch}
                  placeholder="Знайти дисципліну..."
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />

                <Button variant="outline" disabled>
                  Вибрати семестр
                </Button>
              </div>

              {groupLoad ? (
                <SpecializationTable
                  groupLoad={groupLoad}
                  globalSearch={globalSearch}
                  setGlobalSearch={setGlobalSearch}
                />
              ) : (
                <div className="flex flex-col justify-center items-center h-[50%]">
                  <h4 className="font-bold text-lg">Відсутнє навантаження групи!</h4>
                  <p className="text-md">Навчальний план, що використовує група не містить дисциплін</p>
                </div>
              )}
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

        <DialogFooter className="flex !justify-between items-center mt-6 px-4">
          <Button onClick={() => setOpenedModalName("")}>Закрити</Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Редагувати спеціалізовані підгрупи</Button>
            </PopoverTrigger>

            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Спеціалізовані підгрупи</h4>
                </div>

                <div className="max-h-100 overflow-auto pb-2">
                  <div className="border-b-2 flex p-1 font-mono">
                    <div className="w-6">№</div>
                    <div className="flex-1">НАЗВА</div>
                    <div className="">ДІЇ</div>
                  </div>
                  {specializationList.length ? (
                    specializationList.map((el, index) => (
                      <div className="border-b flex items-center text-sm" key={el}>
                        <div className="w-6">{index + 1}</div>
                        <div className="flex-1">{el}</div>
                        <div className="">
                          <Button
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={isPending}
                            onClick={() => onClickEdit(el)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={isPending}
                            onClick={() => {
                              onDeleteSpecGroup(el);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="my-6 flex flex-col text-center">
                      <h5 className="font-semibold">Cпец.підгрупи відсутні</h5>
                      <p className="text-sm">Ще не додано жодної спец.підгрупи</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={onChangeSpecName}
                      disabled={!specName || isPending}
                    >
                      <Check />
                    </Button>

                    <Button
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={onClickCancelEdit}
                      disabled={specActionType === "create" || isPending}
                    >
                      <X />
                    </Button>

                    <Input
                      value={specName}
                      disabled={isPending}
                      className="col-span-2 h-8"
                      placeholder="Назва підгрупи"
                      onChange={(e) => setSpecName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecializationModal;
