"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { pluralizeWords } from "~/helpers/pluralize-words";
import { groupsSelector } from "~/store/groups/groups-slice";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import type { GroupCategoriesType, GroupsShortType } from "~/store/groups/groups-types";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { GroupsTable } from "~/components/features/pages/groups/groups-table";
import { CategoryCard } from "~/components/features/category-card/category-card";
import CategoryActionsModal from "~/components/features/pages/groups/category-actions-modal";
import type { GroupCategoryModalStateType } from "../../components/features/pages/groups/groups-types";

// cookies: categoryFiltes; groupFilters; sort

const GroupsPage = () => {
  const { groupCategories } = useSelector(groupsSelector);

  const [activeStatus, setActiveStatus] = React.useState<"Всі" | "Активний" | "Архів">("Всі");
  const [selectedCategories, setSelectedCategories] = React.useState(groupCategories || []);
  const [modalData, setModalData] = React.useState<GroupCategoryModalStateType>({
    isOpen: false,
    actionType: "create",
  });
  const visibleGroups = useItemsByStatus<GroupCategoriesType>(
    groupCategories as any,
    "groups",
    activeStatus,
  ) as GroupsShortType[];

  console.log(visibleGroups);

  return (
    <>
      <CategoryActionsModal modalData={modalData} setModalData={setModalData} />

      <RootContainer classNames="mb-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Структурні підрозділи</h2>

          <div className="flex items-center gap-2">
            <PopoverFilter
              itemsPrefix=""
              enableSelectAll
              filterVariant="default"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
              items={sortByName(groupCategories) || []}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 flex-wrap mb-10">
          {(groupCategories ? sortByName(groupCategories) : []).map((item) => (
            <CategoryCard
              key={item.id}
              name={item.name}
              label="Підрозділ"
              count={item.groups.length}
              itemsLabel={pluralizeWords(item.groups.length, "group")}
            />
          ))}

          <Card
            onClick={() => setModalData({ isOpen: true, actionType: "create" })}
            className="shadow-none hover:border-primary min-h-[100px] h-[100%] flex items-center justify-center cursor-pointer border-dashed hover:text-primary"
          >
            <p className="flex items-center gap-1">
              <Plus className="w-4" />
              <span className="text-sm">Створити нову</span>
            </p>
          </Card>
        </div>

        <h2 className="text-xl mb-4">Склад підрозділів</h2>

        <Tabs
          className="mb-4"
          defaultValue="Всі"
          onValueChange={(value) => setActiveStatus(value as "Всі" | "Активний" | "Архів")}
        >
          <TabsList>
            <TabsTrigger value="Всі">Всі (12)</TabsTrigger>
            <TabsTrigger value="Активний">Активні (8)</TabsTrigger>
            <TabsTrigger value="Архів">Архів (4)</TabsTrigger>
          </TabsList>
        </Tabs>

        <InputSearch className="mb-8" placeholder="Пошук..." />

        <GroupsTable groups={visibleGroups} />
      </RootContainer>
    </>
  );
};

export default GroupsPage;
