import React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/common/button";
import type { PlansCategoriesType } from "~/store/plans/plans-types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface ISelectPlanTableProps {
  searchValue: string;
  plansCategories: PlansCategoriesType[];
  selectedPlan: { id: number; name: string };
  setSelectedPlan: React.Dispatch<React.SetStateAction<{ id: number; name: string }>>;
}

export const SelectPlanTable: React.FC<ISelectPlanTableProps> = ({
  searchValue,
  selectedPlan,
  setSelectedPlan,
  plansCategories,
}) => {
  const [filteredPlanIds, setFilteredPlanIds] = React.useState<number[]>([]);

  const onSearchChange = () => {
    const filteredByName = plansCategories
      .flatMap((el) => el.plans)
      .filter((el) => el.name.includes(searchValue))
      .map((el) => el.id);

    setFilteredPlanIds(filteredByName);
  };

  React.useEffect(() => {
    if (searchValue) {
      onSearchChange();
    }
  }, [searchValue]);

  return (
    <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
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

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="">
                <div className="flex px-4 py-2 border-b">
                  <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">НАЗВА</div>
                </div>

                <div>
                  {filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan({ name: plan.name, id: plan.id })}
                      className={cn(
                        "hover:border hover:border-primary cursor-pointer flex px-4 py-2 border border-white border-t-border",
                        plan.id === selectedPlan.id &&
                          "border border-primary text-primary bg-primary-light font-semibold",
                      )}
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
