import z from "zod"
import React from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Button } from "@/components/ui/common/button"
import EntitiesDropdown from "../../entities-dropdown"
import { Separator } from "@/components/ui/common/separator"
import type { GroupLoadType } from "@/store/groups/groups-types"
import { createSubgroups } from "@/store/groups/groups-async-actions"
import type { SubgroupsLessonsType } from "@/helpers/group-lesson-by-name-subgroups-and-semester"

const dropdownItems = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
]

const initialFormState = {
  lectures: "",
  practical: "",
  laboratory: "",
  seminars: "",
  exams: "",
}

type LessonsKey = "lectures" | "practical" | "laboratory" | "seminars" | "exams"
type FormFieldsType = {
  label: string
  key: LessonsKey
  disabled: boolean
}

const formFields: FormFieldsType[] = [
  { label: "Лекції", disabled: true, key: "lectures" },
  { label: "Практичні", disabled: true, key: "practical" },
  { label: "Лабораторні", disabled: true, key: "laboratory" },
  { label: "Семінари", disabled: true, key: "seminars" },
  { label: "Екзамен", disabled: true, key: "exams" },
]

const formSchema = z.object({
  lectures: z.number().min(1).max(4).nullable(),
  practical: z.number().min(1).max(4).nullable(),
  laboratory: z.number().min(1).max(4).nullable(),
  seminars: z.number().min(1).max(4).nullable(),
  exams: z.number().min(1).max(4).nullable(),
})

export type SubgroupsFormData = z.infer<typeof formSchema>

const enableExistedLessonTypes = (
  groupLoad: GroupLoadType[] | null,
  formFields: FormFieldsType[],
  selectedLesson: SubgroupsLessonsType | null,
) => {
  if (!groupLoad || !selectedLesson) return formFields
  return formFields.map((field) => {
    const existedLessonTypes = groupLoad.filter(
      (load) => load.planSubjectId.id !== selectedLesson.planSubjectId || load.group.id !== selectedLesson.groupId,
    )

    const disabled = !existedLessonTypes.some((lesson) => lesson.typeEn === field.key)

    return { ...field, disabled }
  })
}

interface ISubgroupsCountModalProps {
  isCountModalOpen: boolean
  groupLoad: GroupLoadType[] | null
  selectedLesson: SubgroupsLessonsType | null
  setIsCountModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SubgroupsCountModal: React.FC<ISubgroupsCountModalProps> = ({
  groupLoad,
  selectedLesson,
  isCountModalOpen,
  setIsCountModalOpen,
}) => {
  const dispatch = useAppDispatch()

  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const onOpenChange = (open: boolean) => {
    setIsCountModalOpen(open)
  }

  const actualFormFields = React.useMemo(
    () => enableExistedLessonTypes(groupLoad, formFields, selectedLesson),
    [groupLoad, selectedLesson],
  )

  const [userFormData, setUserFormData] = React.useState<Partial<SubgroupsFormData>>({})
  const [isPending, setIsPanding] = React.useState(false)

  const formData = {
    ...initialFormState,
    ...(selectedLesson ? selectedLesson : {}),
    ...userFormData,
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!selectedLesson) return
      setIsPanding(true)

      const includedKeys = ["lectures", "practical", "laboratory", "seminars", "exams"]
      await Promise.all(
        Object.entries(formData).map(async ([key, value]) => {
          const isLessonType = includedKeys.includes(key)
          const isDisabled = actualFormFields.find((field) => field.key === key)?.disabled

          if (isLessonType && !isDisabled) {
            const subgroupsCount = value === null ? 1 : Number(value)
            const payload = {
              subgroupsCount,
              typeEn: key as LessonsKey,
              groupId: selectedLesson.groupId,
              planSubjectId: selectedLesson.planSubjectId,
            }
            await dispatch(createSubgroups(payload))
          }
        }),
      )
    } finally {
      setIsCountModalOpen(false)
      setIsPanding(false)
    }
  }

  return (
    <Dialog open={isCountModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="pb-4">
            {selectedLesson ? selectedLesson.name : "Змінити кількість підгруп:"}
          </DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Ви можете встановити кількість підгруп, на які будуть поділятись дисципліни
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="p-4 min-h-[50vh] max-h-[60vh] overflow-auto">
          <form onSubmit={handleSubmit}>
            {actualFormFields.map((field) => {
              const currentValue = formData[field.key]
              const activeItem =
                currentValue === null
                  ? field.disabled
                    ? undefined
                    : { id: 1, name: "1" }
                  : { id: currentValue, name: String(currentValue) }

              return (
                <div className="w-full mb-4">
                  <label className={cn("mb-1", field.disabled ? "opacity-[0.4]" : "")}>{field.label}</label>
                  <EntitiesDropdown
                    items={dropdownItems}
                    activeItem={activeItem}
                    disabled={field.disabled}
                    onChangeSelected={(value) => setUserFormData((prev) => ({ ...prev, [field.key]: Number(value) }))}
                  />
                </div>
              )
            })}

            <button className="hidden" type="submit" ref={buttonRef}></button>
          </form>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center px-4 mt-6">
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              onClick={() => {
                if (buttonRef.current) buttonRef.current.click()
              }}
            >
              Зберегти
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SubgroupsCountModal
