import { useSelector } from "react-redux"
import { useState, type FC, type KeyboardEvent } from "react"
import { ChevronDown, ListFilter, PenLine, Plus } from "lucide-react"

import { useAppDispatch } from "@/store/store"
import { Input } from "@/components/ui/common/input"
import { Button } from "@/components/ui/common/button"
import { plansSelector } from "@/store/plans/plans-slice"
import { Checkbox } from "@/components/ui/common/checkbox"
import { updatePlan } from "@/store/plans/plans-async-actions"
import { InputSearch } from "@/components/ui/custom/input-search"
import { RootContainer } from "@/components/layouts/root-container"
import type { SemesterHoursType } from "@/helpers/group-lessons-by-name"
import { FullPlanTable } from "@/components/features/pages/full-plan/full-plan-table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import SemesterHoursModal from "@/components/features/pages/full-plan/semester-hours-modal"
import SemesterDetailsModal from "@/components/features/pages/full-plan/semester-details-modal"

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

const FullPlanPage: FC = ({}) => {
  const dispatch = useAppDispatch()

  const { plan } = useSelector(plansSelector)

  const [isEditMode, setEditMode] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [planName, setPlanName] = useState(plan?.name ?? "")
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [detailsModalType, setDetailsModalType] = useState<"create" | "update">("update")
  const [selectedSemesterHours, setSelectedSemesterHours] = useState<SemesterHoursType | null>(null)

  const handleChangeEditMode = () => {
    setEditMode((prev) => !prev)
    setPlanName(plan?.name ?? "")
  }

  const onChangePlanName = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!plan) return

      const payload = {
        id: plan.id,
        name: planName,
        status: plan.status,
        categoryId: plan.category.id,
      }

      await dispatch(updatePlan(payload))
      setEditMode(false)
    }
  }

  return (
    <>
      <SemesterHoursModal
        isOpen={isHoursModalOpen}
        setIsOpen={setIsHoursModalOpen}
        selectedSemesterHours={selectedSemesterHours}
        setSelectedSemesterHours={setSelectedSemesterHours}
      />

      <SemesterDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        detailsModalType={detailsModalType}
        setDetailsModalType={setDetailsModalType}
        selectedSemesterHours={selectedSemesterHours}
        setSelectedSemesterHours={setSelectedSemesterHours}
      />

      <RootContainer>
        <div>
          <h1 className="text-2xl mb-4 flex items-center gap-1">
            {isEditMode ? (
              <Input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                onKeyDown={onChangePlanName}
                title="Для збереження змін натисніть кнопку 'Enter'"
              />
            ) : (
              <span>{plan?.name}</span>
            )}

            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="ghost" onClick={handleChangeEditMode}>
                  <PenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isEditMode ? "Завержити редагування" : "Змінити назву"}</TooltipContent>
            </Tooltip>
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <InputSearch
              className="w-full"
              value={globalSearch}
              placeholder="Пошук..."
              onChange={(e) => setGlobalSearch(e.target.value)}
            />

            <Button
              variant="default"
              onClick={() => {
                setDetailsModalType("create")
                setIsDetailsModalOpen(true)
              }}
            >
              <Plus />
              <span>Створити</span>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button disabled>
                  <ListFilter />
                  <span className="hidden lg:inline">Фільтр</span>
                  <span className="lg:hidden">Фільтр</span>
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-50">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all" />
                    <label
                      htmlFor="all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Всі семестри
                    </label>
                  </div>

                  {semesters.map((item) => {
                    return (
                      <div className="flex items-center space-x-2" key={item}>
                        <Checkbox id={item} />
                        <label
                          htmlFor={item}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Семестр {item}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <FullPlanTable
            globalSearch={globalSearch}
            setGlobalSearch={setGlobalSearch}
            setIsHoursModalOpen={setIsHoursModalOpen}
            setIsDetailsModalOpen={setIsDetailsModalOpen}
            setSelectedSemesterHours={setSelectedSemesterHours}
          />
        </div>
      </RootContainer>
    </>
  )
}

export default FullPlanPage
