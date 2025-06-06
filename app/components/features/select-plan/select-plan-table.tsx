import { useNavigate } from "react-router";
import { AlignRight, ChevronsUpDown, Edit, PenLine } from "lucide-react";
import { useCallback, useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { onConfirm } from "../confirm-modal";
import { useAppDispatch } from "~/store/store";
import { ActionsDropdown } from "../actions-dropdown";
import { Button } from "~/components/ui/common/button";
import type { PlanActionModalType } from "~/pages/plans/plans-page";
import { changeAlertModalStatus } from "~/store/general/general-slice";
import type { PlansCategoriesType, PlansType } from "~/store/plans/plans-types";
import { deletePlan, deletePlanCategory } from "~/store/plans/plans-async-actions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import { Badge } from "~/components/ui/common/badge";

interface ISelectPlanTableProps {
  searchValue: string;
  isEditable?: boolean;
  selectedPlan?: PlansType | null;
  plansCategories: PlansCategoriesType[];
  setModalData: Dispatch<SetStateAction<PlanActionModalType>>;
  setSelectedPlan?: Dispatch<SetStateAction<PlansType | null>>;
  setEditablePlan?: React.Dispatch<React.SetStateAction<PlansType | null>>;
  setEditableCategory?: Dispatch<SetStateAction<{ id: number; name: string } | null>>;
}

export const SelectPlanTable: FC<ISelectPlanTableProps> = ({
  searchValue,
  selectedPlan,
  setModalData,
  setSelectedPlan,
  setEditablePlan,
  plansCategories,
  isEditable = false,
  setEditableCategory,
}) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [filteredPlanIds, setFilteredPlanIds] = useState<number[]>([]);

  const onSearchChange = useCallback(() => {
    const filteredByName = plansCategories
      .flatMap((el) => el.plans)
      .filter((el) => el.name.includes(searchValue))
      .map((el) => el.id);

    setFilteredPlanIds(filteredByName);
  }, [plansCategories, searchValue]);

  const onClickCategoryUpdateFunction = (id: number) => {
    setModalData({ isOpen: true, type: "update-category" });
    const editableCategory = plansCategories.find((el) => el.id === id);
    if (editableCategory && setEditableCategory) {
      setEditableCategory({ id, name: editableCategory.name });
    }
  };

  const onClickCategoryDeleteFunction = async (id: number) => {
    if (!id) return;

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити категорію?",
      description: `Категорія, буде видалена назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (!result) return;

    const selectedCategory = plansCategories.find((el) => el.id === id);

    if (!selectedCategory) return;

    if (selectedCategory.plans.length > 0) {
      const alertPayload = {
        isOpen: true,
        title: "Видалення категорії неможливе",
        text: "Категорія не може бути видалена, оскільки вона містить пов’язані навчальні плани. Перед видаленням категорії необхідно спочатку видалити або перемістити всі навчальні плани, які до неї належать.",
      };
      dispatch(changeAlertModalStatus(alertPayload));
      return;
    }

    dispatch(deletePlanCategory(id));
  };

  const onClickUpdateFunction = (id: number) => {
    if (!plansCategories) return;
    const selectedPlan = plansCategories.flatMap((el) => el.plans).find((el) => el.id === id);
    if (!selectedPlan) return;
    setEditablePlan && setEditablePlan(selectedPlan);
    setModalData({ isOpen: true, type: "update-plan" });
  };

  const onClickReviewFunction = (id: number) => {
    navigate(`/plans/${id}`);
  };

  const onClickDeleteFunction = async (id: number) => {
    if (!id) return;

    const confirmPayload = {
      isOpen: true,
      title: `Ви дійсно хочете видалити навчальний план ${name}?`,
      description: `Навчальний план, буде видалений назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);

    if (result) {
      dispatch(deletePlan(id));
    }
  };

  useEffect(() => {
    if (searchValue) {
      onSearchChange();
    }
  }, [searchValue]);

  return (
    <div className={cn(isEditable ? "" : "min-h-[40vh] max-h-[50vh] overflow-y-auto px-4")}>
      {plansCategories.map((el) => {
        let filteredPlans: any[] = [];

        if (searchValue) {
          filteredPlans = el.plans.filter((plan) => filteredPlanIds.includes(plan.id));
        } else {
          filteredPlans = el.plans;
        }

        if (searchValue && !filteredPlans.length) return;

        return (
          <Collapsible className="pt-2 border mb-4" key={el.id} defaultOpen>
            <div className="flex items-center justify-between pl-4 pb-2 pr-2">
              <h4 className="text-sm font-semibold">{el.name}</h4>

              <div className="flex gap-1">
                {isEditable && (
                  <ActionsDropdown
                    itemId={el.id}
                    onClickUpdateFunction={onClickCategoryUpdateFunction}
                    onClickDeleteFunction={onClickCategoryDeleteFunction}
                  />
                )}

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="">
                <div className="flex px-4 py-2 border-b">
                  {isEditable ? (
                    <>
                      <div className="flex-5 uppercase opacity-[0.9] font-mono cursor-default">НАЗВА</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">ДИСЦИПЛІН</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">СТАТУС</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default text-end">ДІЇ</div>
                    </>
                  ) : (
                    <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">НАЗВА</div>
                  )}
                </div>

                <div>
                  {filteredPlans.length ? (
                    filteredPlans.map((plan) => {
                      if (isEditable) {
                        let isStatusActive = true;
                        if (plan.status === "Архів") isStatusActive = false;

                        return (
                          <>
                            <div
                              key={plan.id}
                              onClick={() => {
                                setSelectedPlan && setSelectedPlan({ name: plan.name, id: plan.id } as PlansType);
                                // fix prevent default
                                // onClickUpdateFunction(plan.id);
                              }}
                              className={cn(
                                "hover:border hover:border-primary cursor-pointer flex items-center px-4 py-1 border border-white border-t-border",
                              )}
                            >
                              <div className="flex-5">{plan.name}</div>
                              <div className="flex-1">{plan.subjectsCount}</div>
                              <div className="flex-1">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "border-0",
                                    isStatusActive
                                      ? "text-success bg-success-background"
                                      : "text-error bg-error-background",
                                  )}
                                >
                                  {plan.status}
                                </Badge>
                              </div>
                              <div className="flex-1 text-end">
                                <ActionsDropdown
                                  itemId={plan.id}
                                  additionalItems={[
                                    {
                                      label: "Переглянути",
                                      icon: <AlignRight />,
                                      onClick: () => onClickReviewFunction(el.id),
                                    },
                                    {
                                      label: "Редагувати",
                                      icon: <PenLine />,
                                      onClick: () => onClickUpdateFunction(el.id),
                                    },
                                  ]}
                                  onClickDeleteFunction={onClickDeleteFunction}
                                />
                              </div>
                            </div>
                          </>
                        );
                      } else {
                        return (
                          <div
                            key={plan.id}
                            onClick={() =>
                              setSelectedPlan && setSelectedPlan({ name: plan.name, id: plan.id } as PlansType)
                            }
                            className={cn(
                              "hover:border hover:border-primary cursor-pointer flex px-4 py-2 border border-white border-t-border",
                              plan.id === selectedPlan?.id &&
                                "border border-primary text-primary bg-primary-light font-semibold",
                            )}
                          >
                            {plan.name}
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="uppercase opacity-[0.9] font-mono cursor-default px-4 py-2">-</div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
