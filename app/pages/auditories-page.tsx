"use client";

import React from "react";
import { NavLink } from "react-router";
import { Plus, User } from "lucide-react";
import { useSelector } from "react-redux";

import {
  createAuditoryCategory,
  deleteAuditoryCategory,
  updateAuditoryCategory,
} from "~/store/auditories/auditories-async-actions";
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "~/components/features/category-actions-modal/category-actions-modal-types";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { dialogText } from "~/constants/dialogs-text";
import { Button } from "~/components/ui/common/button";
import { pluralizeWords } from "~/helpers/pluralize-words";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { AlertWindow } from "~/components/features/alert-window";
import { InputSearch } from "~/components/ui/custom/input-search";
import { CategoryCard } from "~/components/features/category-card";
import { useItemsByCategory } from "~/hooks/use-items-by-category";
import { ConfirmWindow } from "~/components/features/confirm-window";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { AUDITORY_FILTERS, AUDITORY_STATUS } from "~/constants/cookies-keys";
import { generalSelector, setAuditoryFilters } from "~/store/general/general-slice";
import { AuditoriesTable } from "~/components/features/pages/auditories/auditories-table";
import type { AuditoriesTypes, AuditoryCategoriesTypes } from "~/store/auditories/auditories-types";
import type { FormData } from "~/components/features/category-actions-modal/category-actions-modal";
import CategoryActionsModal from "~/components/features/category-actions-modal/category-actions-modal";

const AuditoriesPage = () => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  const {
    auditories: { categories: filtredCategories, status: defaultStatus },
  } = useSelector(generalSelector);
  const { auditoriCategories } = useSelector(auditoriesSelector);

  const [globalSearch, setGlobalSearch] = React.useState("");
  const [updatingCategory, setUpdatingCategory] = React.useState<UpdatingCategoryType | null>(null);
  const [activeStatus, setActiveStatus] = React.useState<"Всі" | "Активний" | "Архів">(
    defaultStatus ? defaultStatus : "Всі",
  );
  const [selectedCategories, setSelectedCategories] = React.useState(
    filtredCategories.length
      ? filtredCategories
      : auditoriCategories
      ? auditoriCategories.map((el) => ({ id: el.id }))
      : [],
  );
  const [modalData, setModalData] = React.useState<CategoryModalStateType>({
    isOpen: false,
    actionType: "create",
  });

  const { filteredItems: visibleAuditories, counts } = useItemsByStatus<AuditoryCategoriesTypes>(
    auditoriCategories ?? [],
    "auditories",
    activeStatus,
  ) as { counts: { all: number; active: number; archive: number }; filteredItems: AuditoriesTypes[] };
  const filteredItems = useItemsByCategory(visibleAuditories, selectedCategories);

  const onClickUpdateCategory = (id: number) => {
    if (!auditoriCategories) return;
    const selectedCategory = auditoriCategories.find((el) => el.id === id);
    if (!selectedCategory) return;
    const { name, shortName } = selectedCategory;
    setUpdatingCategory({ id, name, shortName });
    setModalData({ isOpen: true, actionType: "update" });
  };

  const onClickDeleteCategory = async (id: number) => {
    if (!auditoriCategories) return;
    const selectedCategory = auditoriCategories.find((el) => el.id === id);
    if (!selectedCategory) return;

    if (selectedCategory.auditories.length) {
      AlertWindow(dialogText.alert.auditory_category_delete.title, dialogText.alert.auditory_category_delete.text);
      return;
    }

    const confirmed = await ConfirmWindow(dialogText.confirm.category.title, dialogText.confirm.category.text);
    if (confirmed) {
      dispatch(deleteAuditoryCategory(id));
    }
  };

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value);
    setCookie(AUDITORY_STATUS, value);
  };

  const onCreateCategory = async (data: FormData) => {
    const { name, shortName } = data;
    await dispatch(createAuditoryCategory({ name, shortName: String(shortName) }));
  };

  const onUpdateCategory = async (data: FormData & { id: number }) => {
    const { id, name, shortName } = data;
    await dispatch(updateAuditoryCategory({ id, name, shortName: String(shortName) }));
  };

  React.useEffect(() => {
    if (!selectedCategories.length) return;
    const categoriesIds = selectedCategories.map((el) => el.id);
    setCookie(AUDITORY_FILTERS, categoriesIds);
    dispatch(setAuditoryFilters(selectedCategories));
  }, [selectedCategories]);

  return (
    <>
      <CategoryActionsModal
        modalData={modalData}
        setModalData={setModalData}
        updatingCategory={updatingCategory}
        onCreateCategory={onCreateCategory}
        onUpdateCategory={onUpdateCategory}
        setUpdatingCategory={setUpdatingCategory}
      />

      <RootContainer classNames="mb-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Категорії</h2>

          <div className="flex items-center gap-2">
            <NavLink to="/auditories/create">
              <Button variant="outline">
                <Plus /> Створити нову аудиторію
              </Button>
            </NavLink>

            <PopoverFilter
              itemsPrefix=""
              enableSelectAll
              filterVariant="default"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
              items={sortByName(auditoriCategories) || []}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 flex-wrap mb-10">
          {(auditoriCategories ? sortByName(auditoriCategories) : []).map((item) => (
            <CategoryCard
              key={item.id}
              name={item.name}
              ItemsIcon={User}
              label="Категорія"
              itemId={Number(item.id)}
              count={item.auditories.length}
              onClickUpdateFunction={onClickUpdateCategory}
              onClickDeleteFunction={onClickDeleteCategory}
              itemsLabel={pluralizeWords(item.auditories.length, "auditories")}
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

        <h2 className="text-xl mb-4">Список аудиторій</h2>

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
          <AuditoriesTable auditories={filteredItems} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        ) : (
          <div className="font-mono text-center">Пусто</div>
        )}
      </RootContainer>
    </>
  );
};

export default AuditoriesPage;
