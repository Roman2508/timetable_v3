import { NavLink } from "react-router"
import { Plus, User } from "lucide-react"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

import {
  createTeacherCategory,
  deleteTeacherCategory,
  getTeachersCategories,
  updateTeacherCategory,
} from "@/store/teachers/teachers-async-actions"
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "@/components/features/category-actions-modal/category-actions-modal-types"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { sortByName } from "@/helpers/sort-by-name"
import { dialogText } from "@/constants/dialogs-text"
import { Button } from "@/components/ui/common/button"
import { pluralizeWords } from "@/helpers/pluralize-words"
import { useItemsByStatus } from "@/hooks/use-items-by-status"
import { AlertWindow } from "@/components/features/alert-window"
import { InputSearch } from "@/components/ui/custom/input-search"
import { CategoryCard } from "@/components/features/category-card"
import { useItemsByCategory } from "@/hooks/use-items-by-category"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import { ConfirmWindow } from "@/components/features/confirm-window"
import { RootContainer } from "@/components/layouts/root-container"
import { PopoverFilter } from "@/components/ui/custom/popover-filter"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { generalSelector, setTeacherFilters } from "@/store/general/general-slice"
import { TeachersTable } from "@/components/features/pages/teachers/teachers-table"
import type { TeachersCategoryType, TeachersType } from "@/store/teachers/teachers-types"
import type { FormData } from "@/components/features/category-actions-modal/category-actions-modal"
import CategoryActionsModal from "@/components/features/category-actions-modal/category-actions-modal"
import { LoadingStatusTypes } from "@/store/app-types"
import { Skeleton } from "@/components/ui/common/skeleton"

const TeachersPage = () => {
  const dispatch = useAppDispatch()

  const {
    teachers: { categories: filtredCategories, status: defaultStatus },
  } = useSelector(generalSelector)
  const { teachersCategories, loadingStatus } = useSelector(teachersSelector)

  const [globalSearch, setGlobalSearch] = useState("")
  const [updatingCategory, setUpdatingCategory] = useState<UpdatingCategoryType | null>(null)
  const [activeStatus, setActiveStatus] = useState<"Всі" | "Активний" | "Архів">(defaultStatus ? defaultStatus : "Всі")
  const [selectedCategories, setSelectedCategories] = useState<{ id: number }[]>(
    filtredCategories.length
      ? filtredCategories
      : teachersCategories
      ? teachersCategories.map((el) => ({ id: el.id }))
      : [],
  )
  const [modalData, setModalData] = useState<CategoryModalStateType>({ isOpen: false, actionType: "create" })

  const { filteredItems: visibleTeachers, counts } = useItemsByStatus<TeachersCategoryType, "teachers", TeachersType>(
    teachersCategories ?? [],
    "teachers",
    activeStatus,
  )
  const filteredItems = useItemsByCategory(visibleTeachers, selectedCategories)

  const onClickUpdateCategory = (id: number) => {
    if (!teachersCategories) return
    const selectedCategory = teachersCategories.find((el) => el.id === id)
    if (!selectedCategory) return
    const { name, shortName } = selectedCategory
    setUpdatingCategory({ id, name, shortName })
    setModalData({ isOpen: true, actionType: "update" })
  }

  const onClickDeleteCategory = async (id: number) => {
    if (!teachersCategories) return
    const selectedCategory = teachersCategories.find((el) => el.id === id)
    if (!selectedCategory) return

    if (selectedCategory.teachers.length) {
      AlertWindow(dialogText.alert.teacher_category_delete.title, dialogText.alert.teacher_category_delete.text)
      return
    }

    const confirmed = await ConfirmWindow(dialogText.confirm.cmk.title, dialogText.confirm.cmk.text)
    if (confirmed) {
      try {
        const deletedCategoryId = await dispatch(deleteTeacherCategory(id)).unwrap()
        if (deletedCategoryId) {
          setSelectedCategories((prev) => prev.filter((el) => el.id !== deletedCategoryId))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value)
  }

  const onCreateCategory = async (data: FormData) => {
    try {
      const newData = await dispatch(createTeacherCategory(data)).unwrap()
      if (newData) {
        setSelectedCategories((prev) => {
          return [...prev, { id: newData.id, name: newData.name }]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateCategory = async (data: FormData & { id: number }) => {
    await dispatch(updateTeacherCategory(data))

    try {
      const newData = await dispatch(updateTeacherCategory(data)).unwrap()
      if (newData) {
        setSelectedCategories((prev) => {
          const newCategories = prev.map((el) => {
            if (el.id === newData.id) {
              return { id: newData.id, name: newData.name }
            }

            return el
          })
          return newCategories
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    dispatch(getTeachersCategories())
  }, [])

  useEffect(() => {
    if (!selectedCategories.length) return
    dispatch(setTeacherFilters(selectedCategories))
  }, [selectedCategories])

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
          {teachersCategories
            ? sortByName(teachersCategories).map((item) => (
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
              ))
            : [...Array(3)].map((_, index) => <Skeleton key={index} className="h-[130px]" />)}

          {teachersCategories && (
            <Card
              onClick={() => setModalData({ isOpen: true, actionType: "create" })}
              className="shadow-none hover:border-primary min-h-[100px] h-[100%] flex items-center justify-center cursor-pointer border-dashed hover:text-primary"
            >
              <p className="flex items-center gap-1">
                <Plus className="w-4" />
                <span className="text-sm">Створити нову</span>
              </p>
            </Card>
          )}
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
        ) : loadingStatus === LoadingStatusTypes.LOADING ? (
          <div className="font-mono text-center">Завантаження...</div>
        ) : (
          <div className="font-mono text-center">Пусто</div>
        )}
      </RootContainer>
    </>
  )
}

export default TeachersPage
