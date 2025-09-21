import { z } from "zod"
import { useState, type FC, type Dispatch, type MouseEvent, type SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Button } from "@/components/ui/common/button"
import { Checkbox } from "@/components/ui/common/checkbox"
import { Separator } from "@/components/ui/common/separator"
import type { StreamsType } from "@/store/streams/streams-types"
import type { StreamLessonType } from "@/helpers/group-lessons-by-streams"
import { addLessonToStream, deleteLessonFromStream } from "@/store/streams/streams-async-actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/common/dialog"

const checkIsCombined = (subjects: StreamLessonType[]) => {
  const keys = ["lectures", "practical", "laboratory", "seminars", "exams"] as const
  const result: Partial<Record<(typeof keys)[number], true>> = {}

  for (const key of keys) {
    const allValuesExist = subjects.every((subject) => subject[key] !== null)
    if (!allValuesExist) continue

    const allStreamNamesExist = subjects.every((subject) => subject[key]!.streamName !== null)

    if (allStreamNamesExist) {
      result[key] = true
    }
  }

  return result
}

const formSchema = z.object({
  lectures: z.boolean().optional(),
  practical: z.boolean().optional(),
  laboratory: z.boolean().optional(),
  seminars: z.boolean().optional(),
  exams: z.boolean().optional(),
})

export type FormData = z.infer<typeof formSchema>

const defaultFormState = {
  lectures: false,
  practical: false,
  laboratory: false,
  seminars: false,
  exams: false,
}

const formFields = [
  { typeRu: "Лекції", typeEn: "lectures" },
  { typeRu: "Практичні", typeEn: "practical" },
  { typeRu: "Лабораторні", typeEn: "laboratory" },
  { typeRu: "Семінари", typeEn: "seminars" },
  { typeRu: "Екзамен", typeEn: "exams" },
] as const

interface ICombineStreamLessonsModalProps {
  isOpen: boolean
  selectedStream: StreamsType | null
  selectedLessons: StreamLessonType[]
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CombineStreamLessonsModal: FC<ICombineStreamLessonsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedStream,
  selectedLessons,
}) => {
  const dispatch = useAppDispatch()

  const [isPending, setIsPending] = useState(false)
  const [userFormData, setUserFormData] = useState<Partial<FormData>>({})

  const formData = {
    ...defaultFormState,
    ...checkIsCombined(selectedLessons),
    ...userFormData,
  }

  const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!selectedStream) return
      setIsPending(true)

      Object.entries(formData).map(async ([key_, value]) => {
        const key = key_ as keyof typeof formData
        const lessonsIds = selectedLessons
          .map((el) => el[key])
          .filter((el) => !!el)
          .map((el) => el.id)

        if (value) {
          // Об'єднані в потік
          const payload = {
            lessonsIds,
            streamId: selectedStream.id,
            streamName: selectedStream.name,
          }
          await dispatch(addLessonToStream(payload))
        } else {
          // Не об'єднані в потік
          await dispatch(deleteLessonFromStream({ lessonsIds }))
        }
      })

      setIsOpen(false)
    } catch (error) {
    } finally {
      setIsPending(false)
    }
  }

  const handleChange = (key: keyof typeof defaultFormState) => {
    setUserFormData((prev) => {
      return { ...prev, [key]: !prev[key] }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[330px]">
        <DialogHeader>
          <DialogTitle>Об'єднати дисципліни в потік</DialogTitle>
          <p className="text-muted-foreground pb-2 text-sm">
            Виберіть всі типи занятть, які будуть вивчатись одночасно
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col">
              {formFields.map((el) => {
                const isDisabled = selectedLessons.some((lesson) => lesson[el.typeEn] === null)

                return (
                  <div className="h-10" key={el.typeEn}>
                    <label
                      className={cn(
                        "text-base inline-flex items-center gap-2 cursor-pointer",
                        isDisabled ? "opacity-[0.5] cursor-default" : "",
                      )}
                    >
                      <Checkbox
                        name={el.typeEn}
                        disabled={isDisabled}
                        checked={formData[el.typeEn]}
                        onClick={() => handleChange(el.typeEn)}
                      />
                      <span className="select-none">{el.typeRu}</span>
                    </label>
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={isPending} type="submit">
                Зберегти
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default CombineStreamLessonsModal
