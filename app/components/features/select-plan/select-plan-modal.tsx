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
import { onConfirm } from "../confirm-modal";
import { useAppDispatch } from "~/store/store";
import { SelectPlanTable } from "./select-plan-table";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import { Separator } from "~/components/ui/common/separator";
import { InputSearch } from "~/components/ui/custom/input-search";
import type { GroupFormData } from "~/pages/full-group/full-group-page";
import type { PlansCategoriesType } from "~/store/plans/plans-types";

interface IChangePlanModalProps {
  isOpen: boolean;
  defaultValue?: number;
  // defaultValue?: { id: number; name: string };
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>;
  setUserFormData: React.Dispatch<React.SetStateAction<Partial<GroupFormData>>>;
}

const CONFIRM_MODAL_TITLE = "Ви змінюєте навчальний план";
const CONFIRM_MODAL_DESC =
  "Усі дані попереднього навантаження будуть видалені, і на їх місці буде автоматично згенеровано нове навантаження згідно з обраним навчальним планом.";

const MODAL_NAME = "educationPlan";

const findPlanById = (categories: PlansCategoriesType[] | null, planId?: number) => {
  if (!planId || !categories) return null;
  for (const category of categories) {
    const foundPlan = category.plans.find((plan) => plan.id === planId);
    if (foundPlan) return foundPlan;
  }
  return null;
};

const SelectPlanModal: React.FC<IChangePlanModalProps> = ({
  isOpen,
  defaultValue,
  setUserFormData,
  setOpenedModalName,
}) => {
  const dispatch = useAppDispatch();

  const { plansCategories } = useSelector(plansSelector);

  const [searchValue, setSearchValue] = React.useState("");
  const [selectedPlan, setSelectedPlan] = React.useState(findPlanById(plansCategories, defaultValue));

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME));
  };

  const onClickConfirm = async () => {
    // Якщо раніше був вибраний план - перевіряю чи не вибрано інший
    if (defaultValue && defaultValue !== selectedPlan?.id) {
      const result = await onConfirm({ title: CONFIRM_MODAL_TITLE, description: CONFIRM_MODAL_DESC }, dispatch);

      if (result && selectedPlan) {
        setUserFormData((prev) => ({ ...prev, educationPlan: selectedPlan.id }));
      }
    } else {
      // Якщо раніше плану не було (створення нової групи) - зберігаю вибраний план
      if (!selectedPlan) return;
      setUserFormData((prev) => ({ ...prev, educationPlan: selectedPlan.id }));
    }
    onOpenChange();
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

              <SelectPlanTable
                searchValue={searchValue}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                plansCategories={plansCategories}
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
          <Button disabled={!selectedPlan?.id} onClick={() => onClickConfirm()}>
            Зберегти
          </Button>

          <div className="font-mono mr-3 text-right flex flex-col">
            {selectedPlan?.name ? (
              <>
                <p className="font-bold leading-5">Вибраний навчальний план:</p>
                <span className="text-sm">{selectedPlan.name}</span>
              </>
            ) : (
              "Навчальний план не вибрано"
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPlanModal;
