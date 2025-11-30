import { useNavigate } from "react-router"
import { AlignRight, ChevronsUpDown, PenLine } from "lucide-react"
import { Fragment, type Dispatch, type FC, type SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { AlertWindow } from "../alert-window"
import { useAppDispatch } from "@/store/store"
import { ConfirmWindow } from "../confirm-window"
import { Badge } from "@/components/ui/common/badge"
import { dialogText } from "@/constants/dialogs-text"
import { ActionsDropdown } from "../actions-dropdown"
import { Button } from "@/components/ui/common/button"
import type { PlanActionModalType } from "@/pages/plans-page"
import type { PlansCategoriesType, PlansType } from "@/store/plans/plans-types"
import { deletePlan, deletePlanCategory } from "@/store/plans/plans-async-actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/common/collapsible"

interface ISelectPlanTableProps {
  searchValue: string
  isEditable?: boolean
  selectedPlan?: PlansType | null
  plansCategories: PlansCategoriesType[]
  setModalData?: Dispatch<SetStateAction<PlanActionModalType>>
  setSelectedPlan?: Dispatch<SetStateAction<PlansType | null>>
  setSelectedCategories?: Dispatch<SetStateAction<{ id: number }[]>>
  setEditablePlan?: React.Dispatch<React.SetStateAction<PlansType | null>>
  setEditableCategory?: Dispatch<SetStateAction<{ id: number; name: string } | null>>
}

export const SelectPlanTable: FC<ISelectPlanTableProps> = ({
  searchValue,
  selectedPlan,
  setModalData,
  setSelectedPlan,
  setEditablePlan,
  plansCategories,
  isEditable = false,
  setEditableCategory,
  setSelectedCategories,
}) => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const onClickCategoryUpdateFunction = (id: number) => {
    setModalData && setModalData({ isOpen: true, type: "update-category" })
    const editableCategory = plansCategories.find((el) => el.id === id)
    if (editableCategory && setEditableCategory) {
      setEditableCategory({ id, name: editableCategory.name })
    }
  }

  const onClickCategoryDeleteFunction = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.category.title, dialogText.confirm.category.text)
    if (!confirmed) return

    const selectedCategory = plansCategories.find((el) => el.id === id)

    if (!selectedCategory) return

    if (selectedCategory.plans.length > 0) {
      AlertWindow(dialogText.alert.plan_delete.title, dialogText.alert.plan_delete.text)
      return
    }

    try {
      const deletedCategoryId = await dispatch(deletePlanCategory(id)).unwrap()
      if (deletedCategoryId && setSelectedCategories) {
        setSelectedCategories((prev) => prev.filter((el) => el.id !== deletedCategoryId))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onClickUpdateFunction = (id: number) => {
    if (!plansCategories) return
    const selectedPlan = plansCategories.flatMap((el) => el.plans).find((el) => el.id === id)
    if (!selectedPlan) return
    setEditablePlan && setEditablePlan(selectedPlan)
    setModalData && setModalData({ isOpen: true, type: "update-plan" })
  }

  const onClickReviewFunction = (id: number) => {
    navigate(`/plans/${id}`)
  }

  const onClickDeleteFunction = async (id: number) => {
    if (!id) return
    const confirmed = await ConfirmWindow(dialogText.confirm.plan_delete.title, dialogText.confirm.plan_delete.text)
    if (confirmed) {
      dispatch(deletePlan(id))
    }
  }

  return (
    <div className={cn(isEditable ? "" : "min-h-[40vh] max-h-[50vh] overflow-y-auto px-4")}>
      {plansCategories.map((el) => {
        let filteredPlans: any[] = []

        if (searchValue) {
          filteredPlans = el.plans.filter((plan) => plan.name.toLowerCase().includes(searchValue.toLowerCase()))
        } else {
          filteredPlans = el.plans
        }

        if (searchValue && !filteredPlans.length) return

        return (
          <Collapsible className="pt-2 border mb-4 rounded-md" key={el.id} defaultOpen>
            <div className="flex items-center justify-between pl-4 pb-2 pr-2">
              <h4 className="text-sm font-semibold">{el.name}</h4>

              <div className="flex gap-1">
                {isEditable && (
                  <ActionsDropdown
                    itemId={el.id}
                    onClickUpdateFunction={onClickCategoryUpdateFunction}
                    onClickDeleteFunction={onClickCategoryDeleteFunction}
                  />
                )}

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="">
                <div className="flex px-4 py-2 border-b">
                  {isEditable ? (
                    <>
                      <div className="flex-5 uppercase opacity-[0.9] font-mono cursor-default">НАЗВА</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">ДИСЦИПЛІН</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">СТАТУС</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default text-end">ДІЇ</div>
                    </>
                  ) : (
                    <>
                      <div className="flex-9 uppercase opacity-[0.9] font-mono cursor-default">НАЗВА</div>
                      <div className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">ДИСЦИПЛІН</div>
                    </>
                  )}
                </div>

                <div>
                  {filteredPlans.length ? (
                    filteredPlans.map((plan) => {
                      if (isEditable) {
                        return (
                          <Fragment key={plan.id}>
                            <div
                              onClick={() => {
                                setSelectedPlan && setSelectedPlan({ name: plan.name, id: plan.id } as PlansType)
                                onClickReviewFunction(plan.id)
                              }}
                              className={cn(
                                "hover:border hover:border-primary cursor-pointer flex items-center px-4 py-1 border border-white border-t-border",
                              )}
                            >
                              <div className="flex-5">{plan.name}</div>
                              <div className="flex-1">
                                {plan.subjectsCount > 2 ? plan.subjectsCount - 1 : plan.subjectsCount}
                              </div>
                              <div className="flex-1">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "border-0",
                                    plan.status !== "Архів"
                                      ? "text-success bg-success-background"
                                      : "text-error bg-error-background",
                                  )}
                                >
                                  {plan.status}
                                </Badge>
                              </div>
                              <div className="flex-1 text-end">
                                <ActionsDropdown
                                  itemId={plan.id}
                                  additionalItems={[
                                    {
                                      label: "Переглянути",
                                      icon: <AlignRight />,
                                      onClick: () => onClickReviewFunction(el.id),
                                    },
                                    {
                                      label: "Редагувати",
                                      icon: <PenLine />,
                                      onClick: () => onClickUpdateFunction(el.id),
                                    },
                                  ]}
                                  onClickDeleteFunction={onClickDeleteFunction}
                                />
                              </div>
                            </div>
                          </Fragment>
                        )
                      }

                      if (!isEditable) {
                        return (
                          <div
                            key={plan.id}
                            onClick={() =>
                              setSelectedPlan && setSelectedPlan({ name: plan.name, id: plan.id } as PlansType)
                            }
                            className={cn(
                              "hover:border hover:border-primary cursor-pointer flex items-center px-4 py-2 border border-white border-t-border",
                              plan.id === selectedPlan?.id &&
                                "border border-primary text-primary bg-primary-light font-semibold",
                            )}
                          >
                            <div className="flex-9"> {plan.name}</div>
                            <div className="flex-1 text-right">
                              {plan.subjectsCount > 2 ? plan.subjectsCount - 1 : plan.subjectsCount}
                            </div>
                          </div>
                        )
                      }
                    })
                  ) : (
                    <div className="uppercase opacity-[0.9] font-mono cursor-default px-4 py-2">-</div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
