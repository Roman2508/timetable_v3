import { useCallback, useEffect, useState, type FC } from "react"

import { cn } from "@/lib/utils"
import debounse from "lodash/debounce"
import { useAppDispatch } from "@/store/store"
import { TEMPORARY_TEACHER_ID } from "@/constants"
import { Input } from "@/components/ui/common/input"
import { Button } from "@/components/ui/common/button"
import { InputCalendar } from "@/components/ui/custom/input-calendar"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/common/accordion"
import type { IndividualWorkPlanType, TeacherReportType } from "@/store/teacher-profile/teacher-profile-types"
import {
  createTeacherReport,
  deleteTeacherReport,
  updateTeacherReport,
} from "@/store/teacher-profile/teacher-profile-async-actions"

interface IIndividualTeacherWorkItemProps {
  showedYear: number
  selectedWorkTypes: number[]
  addedReport?: TeacherReportType
  workItem: IndividualWorkPlanType
}

const defaultFormData = { plannedDate: new Date().toLocaleDateString(), description: "" }

const IndividualTeacherWorkItem: FC<IIndividualTeacherWorkItemProps> = ({
  workItem,
  showedYear,
  addedReport,
  selectedWorkTypes,
}) => {
  const dispatch = useAppDispatch()

  const isSelected = selectedWorkTypes.some((id) => id === workItem.id)

  const [isFetching, setIsFetching] = useState(false)
  const [userFormData, setUserFormData] = useState({})

  const formData = {
    plannedDate: addedReport ? addedReport.plannedDate : defaultFormData.plannedDate,
    description: addedReport ? addedReport.description : defaultFormData.description,
    ...userFormData,
  }

  const onCreateTeacherReport = async () => {
    try {
      setIsFetching(true)
      const payload = {
        year: showedYear,
        hours: workItem.hours,
        individualWork: workItem.id,
        teacher: TEMPORARY_TEACHER_ID,
        plannedDate: formData.plannedDate,
        description: formData.description,
      }

      await dispatch(createTeacherReport(payload))
    } catch (err) {
      console.log(err)
    } finally {
      setIsFetching(false)
    }
  }

  const onDeleteTeacherReport = async () => {
    try {
      if (!addedReport) return
      setIsFetching(true)
      await dispatch(deleteTeacherReport(addedReport.id))
    } catch (err) {
      console.log(err)
    } finally {
      setIsFetching(false)
    }
  }

  const debouncedUpdateReport = useCallback(
    debounse((payload) => dispatch(updateTeacherReport(payload)), 1000),
    [],
  )

  useEffect(() => {
    if (!addedReport) return
    if (addedReport.description === formData.description && addedReport.plannedDate === formData.plannedDate) return

    const payload = {
      ...addedReport,
      plannedDate: formData.plannedDate,
      description: formData.description,
    }
    debouncedUpdateReport(payload)
  }, [formData])

  return (
    <AccordionItem value={`item-${workItem.id}`} className={cn("mb-4", isSelected ? "border-b-primary" : "")}>
      <AccordionTrigger
        className={cn(
          "flex justify-between items-center py-2 border-b-0",
          isSelected ? "border-primary text-primary bg-primary-light" : "",
        )}
      >
        <p className="flex-1">{workItem.name}</p>
        <div className={cn("border px-2 py-1", isSelected ? "border-primary" : "")}>{workItem.hours}</div>
      </AccordionTrigger>

      <AccordionContent
        className="flex items-end gap-2 px-4 pt-4"
        // @ts-ignore
        wrapperClassName={cn(isSelected ? "border-primary border-b-0" : "")}
      >
        <InputCalendar
          classNames="mb-0"
          label="Дата виконання*"
          value={formData.plannedDate}
          onValueChange={(plannedDate) => setUserFormData((prev) => ({ ...prev, plannedDate }))}
        />

        <div className="flex-1">
          <p className="text-sm mb-1">Зміст роботи*</p>
          <Input
            value={formData.description}
            onChange={(e) => setUserFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <Button
          variant={addedReport ? "destructive" : "default"}
          disabled={isFetching}
          onClick={addedReport ? onDeleteTeacherReport : onCreateTeacherReport}
        >
          {isFetching ? "Завантаження..." : addedReport ? "Видалити зі звіту" : "Додати до звіту"}
        </Button>
      </AccordionContent>
    </AccordionItem>
  )
}

export default IndividualTeacherWorkItem
