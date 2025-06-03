import { useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import { sortByName } from "~/helpers/sort-by-name";
import { Button } from "~/components/ui/common/button";
import { PLAN_STATUS } from "~/constants/cookies-keys";
import { plansSelector } from "~/store/plans/plans-slice";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { generalSelector } from "~/store/general/general-slice";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import type { PlansCategoriesType, PlansType } from "~/store/plans/plans-types";
import { SelectPlanTable } from "~/components/features/select-plan/select-plan-table";

export default function PlansPage() {
  const [_, setCookie] = useCookies();

  const {
    plans: { status: defaultStatus },
  } = useSelector(generalSelector);
  const { plansCategories } = useSelector(plansSelector);

  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlansType | null>({ id: 0, name: "" } as PlansType);
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"Всі" | "Активний" | "Архів">(defaultStatus ? defaultStatus : "Всі");

  const { filteredItems: visiblePlans, counts } = useItemsByStatus<PlansCategoriesType>(
    plansCategories,
    "plans",
    activeStatus,
  );

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value);
    setCookie(PLAN_STATUS, value);
  };

  return (
    <>
      <RootContainer>
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Навчальні плани</h2>

          <div className="flex items-center gap-2">
            <Button variant="outline">Створити новий план</Button>

            <Button variant="outline">Створити нову категорію</Button>

            <PopoverFilter
              itemsPrefix=""
              enableSelectAll
              filterVariant="default"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
              items={sortByName(plansCategories) || []}
            />
          </div>
        </div>

        <Tabs
          className="mb-4"
          defaultValue={activeStatus}
          onValueChange={(value) => changeActiveStatus(value as "Всі" | "Активний" | "Архів")}
        >
          <TabsList>
            <TabsTrigger value="Всі">Всі ({counts.all})</TabsTrigger>
            <TabsTrigger value="Активний">Активні ({counts.active})</TabsTrigger>
            <TabsTrigger value="Архів">Архів ({counts.archive})</TabsTrigger>
          </TabsList>
        </Tabs>

        <InputSearch
          className="mb-4"
          value={globalSearch}
          placeholder="Пошук..."
          onChange={(e) => setGlobalSearch(e.target.value)}
        />

        {plansCategories?.length ? (
          <SelectPlanTable
            isEditable
            searchValue={globalSearch}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            plansCategories={plansCategories ? plansCategories : []}
          />
        ) : (
          <p>Пусто</p>
        )}
      </RootContainer>
    </>
  );
}
