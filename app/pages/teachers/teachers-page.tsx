"use client";

import React from "react";
import { NavLink } from "react-router";
import { Plus, User } from "lucide-react";
import { useSelector } from "react-redux";

import {
  createTeacherCategory,
  deleteTeacherCategory,
  updateTeacherCategory,
} from "~/store/teachers/teachers-async-actions";
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "~/components/features/category-actions-modal/category-actions-modal-types";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { Button } from "~/components/ui/common/button";
import { pluralizeWords } from "~/helpers/pluralize-words";
import { useItemsByStatus } from "~/hooks/use-items-by-status";
import { onConfirm } from "~/components/features/confirm-modal";
import { InputSearch } from "~/components/ui/custom/input-search";
import { CategoryCard } from "~/components/features/category-card";
import { useItemsByCategory } from "~/hooks/use-items-by-category";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { TEACHER_FILTERS, TEACHER_STATUS } from "~/constants/cookies-keys";
import { TeachersTable } from "~/components/features/pages/teachers/teachers-table";
import type { TeachersCategoryType, TeachersType } from "~/store/teachers/teachers-types";
import type { FormData } from "~/components/features/category-actions-modal/category-actions-modal";
import CategoryActionsModal from "~/components/features/category-actions-modal/category-actions-modal";
import { changeAlertModalStatus, generalSelector, setTeacherFilters } from "~/store/general/general-slice";

const TeachersPage = () => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  const {
    teachers: { categories: filtredCategories, status: defaultStatus },
  } = useSelector(generalSelector);
  const { teachersCategories } = useSelector(teachersSelector);

  const [globalSearch, setGlobalSearch] = React.useState("");
  const [updatingCategory, setUpdatingCategory] = React.useState<UpdatingCategoryType | null>(null);
  const [activeStatus, setActiveStatus] = React.useState<"Всі" | "Активний" | "Архів">(
    defaultStatus ? defaultStatus : "Всі",
  );
  const [selectedCategories, setSelectedCategories] = React.useState(
    filtredCategories.length
      ? filtredCategories
      : teachersCategories
      ? teachersCategories.map((el) => ({ id: el.id }))
      : [],
  );
  const [modalData, setModalData] = React.useState<CategoryModalStateType>({
    isOpen: false,
    actionType: "create",
  });

  const { filteredItems: visibleTeachers, counts } = useItemsByStatus<TeachersCategoryType>(
    teachersCategories ?? [],
    "teachers",
    activeStatus,
  ) as { counts: { all: number; active: number; archive: number }; filteredItems: TeachersType[] };
  const filteredItems = useItemsByCategory(visibleTeachers, selectedCategories);

  const onClickUpdateCategory = (id: number) => {
    if (!teachersCategories) return;
    const selectedCategory = teachersCategories.find((el) => el.id === id);
    if (!selectedCategory) return;
    const { name, shortName } = selectedCategory;
    setUpdatingCategory({ id, name, shortName });
    setModalData({ isOpen: true, actionType: "update" });
  };

  const onClickDeleteCategory = async (id: number) => {
    if (!teachersCategories) return;
    const selectedCategory = teachersCategories.find((el) => el.id === id);
    if (!selectedCategory) return;

    if (selectedCategory.teachers.length) {
      const alertPayload = {
        isOpen: true,
        title: "Видалення циклової комісії неможливе",
        text: "Циклова комісія не може бути видалена, оскільки вона містить пов’язаних викладачів. Перед видаленням циклової необхідно спочатку видалити або перемістити всіх викладачів, які до неї належать.",
      };
      dispatch(changeAlertModalStatus(alertPayload));
      return;
    }

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити циклову комісію?",
      description: `Циклову комісію "${selectedCategory.name}" буде видалена назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);
    if (result) {
      dispatch(deleteTeacherCategory(id));
    }
  };

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value);
    setCookie(TEACHER_STATUS, value);
  };

  const onCreateCategory = async (data: FormData) => {
    await dispatch(createTeacherCategory(data));
  };

  const onUpdateCategory = async (data: FormData & { id: number }) => {
    await dispatch(updateTeacherCategory(data));
  };

  React.useEffect(() => {
    if (!selectedCategories.length) return;
    const categoriesIds = selectedCategories.map((el) => el.id);
    setCookie(TEACHER_FILTERS, categoriesIds);
    dispatch(setTeacherFilters(selectedCategories));
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
          <h2 className="text-xl">Циклові комісії</h2>

          <div className="flex items-center gap-2">
            <NavLink to="/teachers/create">
              <Button variant="outline">
                <Plus /> Створити нового викладача
              </Button>
            </NavLink>

            <PopoverFilter
              itemsPrefix=""
              enableSelectAll
              filterVariant="default"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
              items={sortByName(teachersCategories) || []}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 flex-wrap mb-10">
          {(teachersCategories ? sortByName(teachersCategories) : []).map((item) => (
            <CategoryCard
              key={item.id}
              name={item.name}
              ItemsIcon={User}
              label="Циклова комісія"
              itemId={Number(item.id)}
              count={item.teachers.length}
              onClickUpdateFunction={onClickUpdateCategory}
              onClickDeleteFunction={onClickDeleteCategory}
              itemsLabel={pluralizeWords(item.teachers.length, "teachers")}
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

        <h2 className="text-xl mb-4">Кадровий склад</h2>

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
          <TeachersTable teachers={filteredItems} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        ) : (
          <div className="font-mono text-center">Пусто</div>
        )}
      </RootContainer>
    </>
  );
};

export default TeachersPage;
