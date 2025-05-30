import React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { ActionsDropdown } from "../actions-dropdown";
import { Button } from "~/components/ui/common/button";
import type { PlansCategoriesType, PlansType } from "~/store/plans/plans-types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface ISelectPlanTableProps {
  searchValue: string;
  isEditable?: boolean;
  plansCategories: PlansCategoriesType[];
  selectedPlan: PlansType | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<PlansType | null>>;
}

export const SelectPlanTable: React.FC<ISelectPlanTableProps> = ({
  searchValue,
  selectedPlan,
  setSelectedPlan,
  plansCategories,
  isEditable = false,
}) => {
  const [filteredPlanIds, setFilteredPlanIds] = React.useState<number[]>([]);

  const onSearchChange = React.useCallback(() => {
    const filteredByName = plansCategories
      .flatMap((el) => el.plans)
      .filter((el) => el.name.includes(searchValue))
      .map((el) => el.id);

    setFilteredPlanIds(filteredByName);
  }, [plansCategories, searchValue]);

  const onClickCategoryUpdateFunction = () => {};

  const onClickCategoryDeleteFunction = () => {};

  const onClickUpdateFunction = () => {};

  const onClickDeleteFunction = () => {};

  React.useEffect(() => {
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
                    itemId={1}
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
                        return (
                          <>
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan({ name: plan.name, id: plan.id } as PlansType)}
                              className={cn(
                                "hover:border hover:border-primary cursor-pointer flex items-center px-4 py-1 border border-white border-t-border",
                              )}
                            >
                              <div className="flex-5">{plan.name}</div>
                              <div className="flex-1">11</div>
                              <div className="flex-1 text-end">
                                <ActionsDropdown
                                  itemId={plan.id}
                                  onClickUpdateFunction={onClickUpdateFunction}
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
                            onClick={() => setSelectedPlan({ name: plan.name, id: plan.id } as PlansType)}
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
