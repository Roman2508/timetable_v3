"use client";

import React from "react";
import { NavLink } from "react-router";
import { Plus, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import CategoryActionsModal, {
  type FormData,
} from "~/components/features/category-actions-modal/category-actions-modal";
import type {
  CategoryModalStateType,
  UpdatingCategoryType,
} from "~/components/features/category-actions-modal/category-actions-modal-types";
import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { dialogText } from "~/constants/dialogs-text";
import { Button } from "~/components/ui/common/button";
import { pluralizeWords } from "~/helpers/pluralize-words";
import { groupsSelector } from "~/store/groups/groups-slice";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { AlertWindow } from "~/components/features/alert-window";
import { InputSearch } from "~/components/ui/custom/input-search";
import { CategoryCard } from "~/components/features/category-card";
import { useItemsByCategory } from "~/hooks/use-items-by-category";
import { ConfirmWindow } from "~/components/features/confirm-window";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { GROUP_FILTERS, GROUP_STATUS } from "~/constants/cookies-keys";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { GroupsTable } from "~/components/features/pages/groups/groups-table";
import { generalSelector, setGroupFilters } from "~/store/general/general-slice";
import type { GroupCategoriesType, GroupsShortType } from "~/store/groups/groups-types";
import { createGroupCategory, deleteGroupCategory, updateGroupCategory } from "~/store/groups/groups-async-actions";

const GroupsPage = () => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  const {
    groups: { categories: filtredCategories, status: defaultStatus },
  } = useSelector(generalSelector);
  const { groupCategories } = useSelector(groupsSelector);

  const [globalSearch, setGlobalSearch] = React.useState("");
  const [updatingCategory, setUpdatingCategory] = React.useState<UpdatingCategoryType | null>(null);
  const [activeStatus, setActiveStatus] = React.useState<"Всі" | "Активний" | "Архів">(
    defaultStatus ? defaultStatus : "Всі",
  );
  const [selectedCategories, setSelectedCategories] = React.useState(
    filtredCategories.length ? filtredCategories : groupCategories ? groupCategories.map((el) => ({ id: el.id })) : [],
  );
  const [modalData, setModalData] = React.useState<CategoryModalStateType>({
    isOpen: false,
    actionType: "create",
  });

  const { filteredItems: visibleGroups, counts } = useItemsByStatus<GroupCategoriesType>(
    groupCategories,
    "groups",
    activeStatus,
  ) as { counts: { all: number; active: number; archive: number }; filteredItems: GroupsShortType[] };
  const filteredItems = useItemsByCategory(visibleGroups, selectedCategories);

  const onClickUpdateCategory = (id: number) => {
    if (!groupCategories) return;
    const selectedCategory = groupCategories.find((el) => el.id === id);
    if (!selectedCategory) return;
    const { name, shortName } = selectedCategory;
    setUpdatingCategory({ id, name, shortName });
    setModalData({ isOpen: true, actionType: "update" });
  };

  const onClickDeleteCategory = async (id: number) => {
    if (!groupCategories) return;
    const selectedCategory = groupCategories.find((el) => el.id === id);
    if (!selectedCategory) return;

    if (selectedCategory.groups.length) {
      AlertWindow(dialogText.alert.group_category_delete.title, dialogText.alert.group_category_delete.text);
      return;
    }

    const confirmed = await ConfirmWindow(dialogText.confirm.unit.title, dialogText.confirm.unit.text);
    if (confirmed) {
      dispatch(deleteGroupCategory(id));
    }
  };

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value);
    setCookie(GROUP_STATUS, value);
  };

  const onCreateCategory = async (data: FormData) => {
    const { name, shortName } = data;
    await dispatch(createGroupCategory({ name, shortName: String(shortName) }));
  };

  const onUpdateCategory = async (data: FormData & { id: number }) => {
    const { id, name, shortName } = data;
    await dispatch(updateGroupCategory({ id, name, shortName: String(shortName) }));
  };

  React.useEffect(() => {
    if (!selectedCategories.length) return;
    const categoriesIds = selectedCategories.map((el) => el.id);
    setCookie(GROUP_FILTERS, categoriesIds);
    dispatch(setGroupFilters(selectedCategories));
  }, [selectedCategories]);

  return (
    <>
      <CategoryActionsModal
        modalData={modalData}
        setModalData={setModalData}
        updatingCategory={updatingCategory}
        onUpdateCategory={onUpdateCategory}
        onCreateCategory={onCreateCategory}
        setUpdatingCategory={setUpdatingCategory}
      />

      <RootContainer classNames="mb-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Структурні підрозділи</h2>

          <div className="flex items-center gap-2">
            <NavLink to="/groups/create">
              <Button variant="outline">
                <Plus /> Створити нову групу
              </Button>
            </NavLink>

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
              ItemsIcon={User}
              label="Підрозділ"
              itemId={Number(item.id)}
              count={item.groups.length}
              onClickUpdateFunction={onClickUpdateCategory}
              onClickDeleteFunction={onClickDeleteCategory}
              itemsLabel={pluralizeWords(item.groups.length, "group")}
            />
          ))}

          <Card
            onClick={() => setModalData({ isOpen: true, actionType: "create" })}
            className="shadow-none hover:border-primary min-h-[100px] h-[100%] flex items-center justify-center cursor-pointer border-dashed hover:text-primary"
          >
            <p className="flex items-center gap-1">
              <Plus className="w-4" />
              <span className="text-sm">Створити новий</span>
            </p>
          </Card>
        </div>

        <h2 className="text-xl mb-4">Склад підрозділів</h2>

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
          className="mb-8"
          value={globalSearch}
          placeholder="Пошук..."
          onChange={(e) => setGlobalSearch(e.target.value)}
        />

        {filteredItems.length ? (
          <GroupsTable groups={filteredItems} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        ) : (
          <div className="font-mono text-center">Пусто</div>
        )}
      </RootContainer>
    </>
  );
};

export default GroupsPage;
