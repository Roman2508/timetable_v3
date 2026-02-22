import { useSelector } from "react-redux"
import { FolderPlus, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { useAppDispatch } from "@/store/store"
import { sortByName } from "@/helpers/sort-by-name"
import { Badge } from "@/components/ui/common/badge"
import { Button } from "@/components/ui/common/button"
import { LoadingStatusTypes } from "@/store/app-types"
import { plansSelector } from "@/store/plans/plans-slice"
import { Skeleton } from "@/components/ui/common/skeleton"
import { InputSearch } from "@/components/ui/custom/input-search"
import { RootContainer } from "@/components/layouts/root-container"
import { PageTopTitle } from "@/components/features/page-top-title"
import { PopoverFilter } from "@/components/ui/custom/popover-filter"
import { getPlansCategories } from "@/store/plans/plans-async-actions"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { useItemsByStatus, type ItemType } from "@/hooks/use-items-by-status"
import { generalSelector, setPlanFilters } from "@/store/general/general-slice"
import type { PlansCategoriesType, PlansType } from "@/store/plans/plans-types"
import PlanActionsModal from "@/components/features/pages/plans/plan-actions-modal"
import { SelectPlanTable } from "@/components/features/select-plan/select-plan-table"

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
  }

  useEffect(() => {
    dispatch(getPlansCategories())
  }, [])

  useEffect(() => {
    if (selectedCategories.length || !plansCategories) return
    const categories = plansCategories.map((el: any) => ({ id: el.id }))
    setSelectedCategories(categories)
  }, [plansCategories])

  useEffect(() => {
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
          <PageTopTitle title="Навчальні плани" description="Управління навчальними планами та їх категоріями" />

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setModalData({ isOpen: true, type: "create-plan" })}>
              <Plus />
              Новий план
            </Button>

            <Button variant="outline" onClick={() => setModalData({ isOpen: true, type: "create-category" })}>
              <FolderPlus />
              Нова категорія
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

        <div className="flex justify-between items-center mb-4">
          <Tabs
            className="mb-4"
            defaultValue={activeStatus}
            onValueChange={(value) => changeActiveStatus(value as "Всі" | "Активний" | "Архів")}
          >
            <TabsList>
              <TabsTrigger value="Всі">
                Всі <Badge variant="secondary">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Активний">
                Активні <Badge variant="secondary">{counts.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Архів">
                Архів <Badge variant="secondary">{counts.archive}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <InputSearch
            value={globalSearch}
            placeholder="Пошук..."
            className="max-w-72 w-full"
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

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
