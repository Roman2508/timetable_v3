import { z } from "zod"
import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import EntityField from "../../entity-field"
import { useAppDispatch } from "@/store/store"
import { sortByName } from "@/helpers/sort-by-name"
import { Button } from "@/components/ui/common/button"
import { Separator } from "@/components/ui/common/separator"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import type { SemesterHoursType } from "@/helpers/group-lessons-by-name"
import { createPlanSubjects, updatePlanSubjectsName } from "@/store/plans/plans-async-actions"

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }),
  cmk: z.number({ message: "Це поле обов'язкове" }).min(1, "Це поле обов'язкове"),
})

export type FormData = z.infer<typeof formSchema>

interface ISemesterDetailsModalProps {
  isOpen: boolean
  detailsModalType: "create" | "update"
  setIsOpen: Dispatch<SetStateAction<boolean>>
  selectedSemesterHours: SemesterHoursType | null
  setDetailsModalType: Dispatch<SetStateAction<"create" | "update">>
  setSelectedSemesterHours: Dispatch<SetStateAction<SemesterHoursType | null>>
}

const SemesterDetailsModal: React.FC<ISemesterDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  detailsModalType,
  setDetailsModalType,
  selectedSemesterHours,
  setSelectedSemesterHours,
}) => {
  const dispatch = useAppDispatch()

  const { id: planId } = useParams()

  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const { teachersCategories } = useSelector(teachersSelector)

  const formFields = useMemo(
    () => [
      {
        title: "Дисципліна*",
        key: "name",
        text: "Назва дисципліни, що відображається в розкладі",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Циклова комісія*",
        key: "cmk",
        text: "Використовується для розподілу навчального навантаження",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: sortByName(teachersCategories),
      },
    ],
    [teachersCategories],
  )

  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const formData = {
    name: selectedSemesterHours ? selectedSemesterHours.name : "",
    cmk: selectedSemesterHours ? selectedSemesterHours.cmk.id : 0,
    ...userFormData,
  }

  const validate = () => {
    const res = formSchema.safeParse(formData)
    if (res.success) return
    return res.error.format()
  }

  const errors = showErrors ? validate() : undefined

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedSemesterHours(null)
      setDetailsModalType("update")
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsPending(true)
      const errors = validate()
      if (errors) {
        setShowErrors(true)
        return
      }

      if (detailsModalType === "create") {
        const payload = { name: formData.name, cmk: formData.cmk, planId: Number(planId) }
        await dispatch(createPlanSubjects(payload))
        onOpenChange(false)
        setUserFormData({})
        return
      }

      if (detailsModalType === "update" && selectedSemesterHours) {
        const payload = {
          cmk: formData.cmk,
          newName: formData.name,
          planId: Number(planId),
          oldName: selectedSemesterHours.name,
        }

        await dispatch(updatePlanSubjectsName(payload))
        onOpenChange(false)
        setUserFormData({})
      }
    } finally {
      setIsPending(false)
    }
  }

  const onSubmitClick = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }

  const deleteSemesterConfirmation = async () => {
    alert("Якщо раніше був вибраний план - перевіряю чи не вибрано інший")
    // // Якщо раніше був вибраний план - перевіряю чи не вибрано інший
    // if (defaultValue !== selectedPlan?.id) {
    //   const result = await onConfirm({ title: CONFIRM_MODAL_TITLE, description: CONFIRM_MODAL_DESC }, dispatch);
    //   if (result && selectedPlan) {
    //     setUserFormData((prev) => ({ ...prev, educationPlan: selectedPlan.id }));
    //   }
    // } else {
    //   // Якщо раніше плану не було (створення нової групи) - зберігаю вибраний план
    //   if (!selectedPlan) return;
    //   setUserFormData((prev) => ({ ...prev, educationPlan: selectedPlan.id }));
    // }
    // onOpenChange();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 !py-4 max-w-[600px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="flex items-center gap-1">
            {selectedSemesterHours && detailsModalType === "update" && selectedSemesterHours.name}
            {detailsModalType === "create" && "Нова дисципліна"}
          </DialogTitle>

          <div className="flex justify-between items-center leading-[1.25] opacity-[.6] text-sm">
            <p>{selectedSemesterHours ? `ЦК ${selectedSemesterHours.cmk.name}` : ""}</p>
          </div>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form className="px-4 py-4 max-h-125 overflow-y-auto" onSubmit={handleSubmit}>
            {formFields.map((input) => {
              const currentValue = formData[input.key as keyof FormData] as FormData[keyof FormData]

              return (
                <EntityField
                  {...input}
                  key={input.key}
                  errors={errors}
                  isUpdate={false}
                  inputKey={input.key}
                  isEditable={!isPending}
                  labelClassNames="min-w-65"
                  currentValue={currentValue}
                  setUserFormData={setUserFormData}
                  inputType={input.inputType as "string" | "number"}
                  variant={input.variant as "input" | "select" | "button"}
                />
              )
            })}

            <button className="hidden" ref={submitButtonRef}></button>
          </form>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-4 px-4">
          <Button disabled={isPending} onClick={onSubmitClick}>
            Зберегти
          </Button>

          {detailsModalType === "update" && (
            <Button disabled={isPending} onClick={deleteSemesterConfirmation} variant="destructive">
              Видалити
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SemesterDetailsModal
