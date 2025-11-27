import { z } from "zod"
import { useParams } from "react-router"
import { useRef, useState, type Dispatch, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { cn } from "@/lib/utils"
import EntityField from "../../entity-field"
import { useAppDispatch } from "@/store/store"
import { ConfirmWindow } from "../../confirm-window"
import { dialogText } from "@/constants/dialogs-text"
import { Button } from "@/components/ui/common/button"
import { Separator } from "@/components/ui/common/separator"
import type { SemesterHoursType } from "@/helpers/group-lessons-by-name"
import { deletePlanSubjects, updatePlanSubjectsHours } from "@/store/plans/plans-async-actions"

const calculateTotalHours = (hours: SemesterHoursType): number => {
  return hours.lectures + hours.practical + hours.laboratory + hours.seminars + hours.independentWork
}

const formFields = [
  {
    title: "Лекції*",
    key: "lectures",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Практичні*",
    key: "practical",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Лабораторні*",
    key: "laboratory",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Семінари*",
    key: "seminars",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Екзамени*",
    key: "exams",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Консультація перед екзаменом*",
    key: "examsConsulation",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Методичне керівництво*",
    key: "metodologicalGuidance",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Самостійна робота*",
    key: "independentWork",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
  {
    title: "Загальна кількість годин*",
    key: "totalHours",
    text: "",
    isEditable: true,
    inputType: "number",
    variant: "input",
    items: [],
  },
]

const initialFormData = {
  lectures: 0,
  practical: 0,
  laboratory: 0,
  seminars: 0,
  exams: 0,
  examsConsulation: 0,
  metodologicalGuidance: 0,
  independentWork: 0,
  totalHours: 0,
}

const formSchema = z.object({
  lectures: z.number({ message: "Це поле обов'язкове" }).optional(),
  practical: z.number({ message: "Це поле обов'язкове" }).optional(),
  laboratory: z.number({ message: "Це поле обов'язкове" }).optional(),
  seminars: z.number({ message: "Це поле обов'язкове" }).optional(),
  exams: z.number({ message: "Це поле обов'язкове" }).optional(),
  examsConsulation: z.number({ message: "Це поле обов'язкове" }).optional(),
  metodologicalGuidance: z.number({ message: "Це поле обов'язкове" }).optional(),
  independentWork: z.number({ message: "Це поле обов'язкове" }).optional(),
  totalHours: z.number({ message: "Це поле обов'язкове" }),
})

export type FormData = z.infer<typeof formSchema>

interface ISemesterHoursModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  selectedSemesterHours: SemesterHoursType | null
  setSelectedSemesterHours: Dispatch<SetStateAction<SemesterHoursType | null>>
}

const SemesterHoursModal: React.FC<ISemesterHoursModalProps> = ({
  isOpen,
  setIsOpen,
  selectedSemesterHours,
  setSelectedSemesterHours,
}) => {
  const dispatch = useAppDispatch()
  const params = useParams()

  const submitButtonRef = useRef<HTMLButtonElement | null>(null)

  const [userFormData, setUserFormData] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const formData = {
    ...initialFormData,
    ...selectedSemesterHours,
    ...userFormData,
  } as SemesterHoursType

  const validate = () => {
    const res = formSchema.safeParse(formData)
    if (res.success) return
    return res.error.format()
  }

  const errors = showErrors ? validate() : undefined

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setSelectedSemesterHours(null)
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    const planId = params.id
    if (!planId || isNaN(+planId)) return
    try {
      e.preventDefault()
      setIsPending(true)
      const errors = validate()
      if (errors) {
        setShowErrors(true)
        return
      }

      await dispatch(updatePlanSubjectsHours({ ...formData, planId: +planId, cmk: formData.cmk.id }))
      setUserFormData({})
    } finally {
      setIsOpen(false)
      setIsPending(false)
      setSelectedSemesterHours(null)
    }
  }

  const deleteSemesterConfirmation = async () => {
    if (!selectedSemesterHours) return

    setIsOpen(false)

    const confirmed = await ConfirmWindow(
      dialogText.confirm.plan_hours_delete.title,
      dialogText.confirm.plan_hours_delete.text,
    )

    if (confirmed) {
      await dispatch(deletePlanSubjects(selectedSemesterHours.id))
      setSelectedSemesterHours(null)
      return
    }

    setIsOpen(true)
  }

  const onSubmitClick = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click()
    }
  }

  const checkDisabled = () => {
    return isPending || !formData.totalHours || calculateTotalHours(formData) !== formData.totalHours
  }

  if (!selectedSemesterHours) return

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 !py-4 max-w-[500px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="flex items-center gap-1">{selectedSemesterHours.name}</DialogTitle>

          <div className="flex justify-between items-center leading-[1.25] opacity-[.6] text-sm">
            <div>
              <p>{selectedSemesterHours ? `${selectedSemesterHours.cmk.name}` : ""}</p>
              <p>Cеместр: {selectedSemesterHours.semesterNumber}</p>
            </div>

            <p
              className={cn(
                calculateTotalHours(formData) !== formData.totalHours || !formData.totalHours ? "text-error" : "",
              )}
            >
              {calculateTotalHours(formData)}/{formData.totalHours}
            </p>
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
                  errors={errors}
                  isUpdate={false}
                  inputKey={input.key}
                  isEditable={!isPending}
                  labelClassNames="min-w-70"
                  currentValue={currentValue}
                  classNames="mb-2 items-center"
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
          <Button disabled={checkDisabled()} onClick={onSubmitClick}>
            Зберегти
          </Button>
          <Button disabled={checkDisabled()} onClick={deleteSemesterConfirmation} variant="destructive">
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SemesterHoursModal
