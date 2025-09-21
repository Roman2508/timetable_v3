import { useSelector } from "react-redux"
import { useEffect, useMemo, useState } from "react"

import { useAppDispatch } from "@/store/store"
import { sortByName } from "@/helpers/sort-by-name"
import { Button } from "@/components/ui/common/button"
import { plansSelector } from "@/store/plans/plans-slice"
import { InputSearch } from "@/components/ui/custom/input-search"
import { RootContainer } from "@/components/layouts/root-container"
import { PopoverFilter } from "@/components/ui/custom/popover-filter"
import { getPlansCategories } from "@/store/plans/plans-async-actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { useItemsByStatus, type ItemType } from "@/hooks/use-items-by-status"
import { generalSelector, setPlanFilters } from "@/store/general/general-slice"
import type { PlansCategoriesType, PlansType } from "@/store/plans/plans-types"
import PlanActionsModal from "@/components/features/pages/plans/plan-actions-modal"
import { SelectPlanTable } from "@/components/features/select-plan/select-plan-table"
import { LoadingStatusTypes } from "@/store/app-types"
import { Skeleton } from "@/components/ui/common/skeleton"

export type PlanActionModalType = {
  isOpen: boolean
  type: "create-category" | "update-category" | "create-plan" | "update-plan"
}

const getVisiblePlanCategories = (
  plansCategories: PlansCategoriesType[] | null,
  selectedCategories: { id: number }[],
  filteredItems: ItemType[],
) => {
  if (!plansCategories) return []
  const selectedPlanCategories = plansCategories.filter((category) => {
    return selectedCategories.some((el) => el.id === category.id)
  })

  const visiblePlans = selectedPlanCategories.map((category: PlansCategoriesType) => {
    const plans = filteredItems.filter((plan) => plan.category.id === category.id)
    return { ...category, plans }
  }) as PlansCategoriesType[]

  return visiblePlans
}

export default function PlansPage() {
  const dispatch = useAppDispatch()

  // !!! Доробити expanded:
  const {
    plans: { status: defaultStatus, categories: filtredCategories },
  } = useSelector(generalSelector)
  const { plansCategories, loadingStatus } = useSelector(plansSelector)

  const [globalSearch, setGlobalSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<{ id: number }[]>(
    filtredCategories.length
      ? filtredCategories
      : plansCategories
      ? plansCategories.map((el: any) => ({ id: el.id }))
      : [],
  )
  const [editablePlan, setEditablePlan] = useState<PlansType | null>(null)
  const [editableCategory, setEditableCategory] = useState<{ id: number; name: string } | null>(null)
  const [modalData, setModalData] = useState<PlanActionModalType>({ isOpen: false, type: "create-plan" })
  const [activeStatus, setActiveStatus] = useState<"Всі" | "Активний" | "Архів">(defaultStatus ? defaultStatus : "Всі")

  const { filteredItems, counts } = useItemsByStatus<PlansCategoriesType, "plans", PlansType>(
    plansCategories,
    "plans",
    activeStatus,
  )
  const visiblePlans = useMemo(
    () => getVisiblePlanCategories(plansCategories, selectedCategories, filteredItems),
    [plansCategories, selectedCategories, filteredItems],
  )

  const changeActiveStatus = (value: "Всі" | "Активний" | "Архів") => {
    setActiveStatus(value)
    // setCookie(PLAN_STATUS, value)
  }

  useEffect(() => {
    dispatch(getPlansCategories())
  }, [])

  useEffect(() => {
    if (!selectedCategories.length) return
    dispatch(setPlanFilters(selectedCategories))
  }, [selectedCategories])

  return (
    <>
      <PlanActionsModal
        modalData={modalData}
        setModalData={setModalData}
        editablePlan={editablePlan}
        editableCategory={editableCategory}
        setEditableCategory={setEditableCategory}
        setSelectedCategories={setSelectedCategories}
      />

      <RootContainer>
        <div className="flex justify-between mb-6">
          <h2 className="text-xl">Навчальні плани</h2>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setModalData({ isOpen: true, type: "create-plan" })}>
              Створити новий план
            </Button>

            <Button variant="outline" onClick={() => setModalData({ isOpen: true, type: "create-category" })}>
              Створити нову категорію
            </Button>

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

        {!plansCategories && loadingStatus === LoadingStatusTypes.LOADING && (
          <div>
            <Skeleton className="w-full h-10 mb-4" />
            <Skeleton className="w-full h-10 mb-4" />
            <Skeleton className="w-full h-10 mb-4" />
          </div>
        )}

        {!!plansCategories?.length && (
          <SelectPlanTable
            isEditable
            searchValue={globalSearch}
            setModalData={setModalData}
            setEditablePlan={setEditablePlan}
            setEditableCategory={setEditableCategory}
            setSelectedCategories={setSelectedCategories}
            plansCategories={visiblePlans ? visiblePlans : []}
          />
        )}

        {!plansCategories?.length && loadingStatus !== LoadingStatusTypes.LOADING && (
          <div className="font-mono py-20 text-center">Пусто</div>
        )}
      </RootContainer>
    </>
  )
}
