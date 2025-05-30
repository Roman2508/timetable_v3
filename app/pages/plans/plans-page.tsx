import React from "react";
import { useSelector } from "react-redux";
import { ChevronsUpDown, Ellipsis, GripVertical } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import { RootContainer } from "~/components/layouts/root-container";
import { SelectPlanTable } from "~/components/features/select-plan/select-plan-table";
import type { PlansCategoriesType, PlansType, PlanType } from "~/store/plans/plans-types";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { InputSearch } from "~/components/ui/custom/input-search";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { useItemsByCategory } from "~/hooks/use-items-by-category";
import { generalSelector } from "~/store/general/general-slice";
import { useCookies } from "react-cookie";
import { PLAN_STATUS } from "~/constants/cookies-keys";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { sortByName } from "~/helpers/sort-by-name";

//  const plansCategories = [
//     {
//       id: 1,
//       name: "І8 Фармація. Денна форма 2025",
//       plans: [
//         {
//           id: 1,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 2,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 3,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 4,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 5,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "І8 Фармація. Денна форма 2025",
//       plans: [
//         {
//           id: 10,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 11,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 11,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 12,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 12,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 13,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 13,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 14,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 14,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 15,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 15,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: "І8 Фармація. Денна форма 2025",
//       plans: [
//         {
//           id: 1,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 1,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 1,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//         {
//           id: 1,
//           name: "І8 Фармація 2025",
//           category: {
//             id: 1,
//             name: "І8 Фармація. Денна форма 2025",
//           },
//         },
//       ],
//     },
//   ];

export default function PlansPage() {
  const [_, setCookie] = useCookies();

  const {
    plans: { status: defaultStatus },
  } = useSelector(generalSelector);
  const { plansCategories } = useSelector(plansSelector);

  const [selectedCategories, setSelectedCategories] = React.useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = React.useState<PlansType | null>({ id: 0, name: "" } as PlansType);
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [activeStatus, setActiveStatus] = React.useState<"Всі" | "Активний" | "Архів">(
    defaultStatus ? defaultStatus : "Всі",
  );

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
  );
}
