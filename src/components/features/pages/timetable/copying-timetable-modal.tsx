import { useSelector } from "react-redux"
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { customDayjs } from "@/lib/dayjs"
import { useAppDispatch } from "@/store/store"
import { Label } from "@/components/ui/common/label"
import { Button } from "@/components/ui/common/button"
import { Separator } from "@/components/ui/common/separator"
import { generalSelector } from "@/store/general/general-slice"
import { settingsSelector } from "@/store/settings/settings-slice"
import { InputCalendar } from "@/components/ui/custom/input-calendar"
import { AlertDialogHeader } from "@/components/ui/common/alert-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/common/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import { copyDaySchedule, copyWeekSchedule } from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/common/dialog"

type CopingWeekType = { weekNumber: number; dateRange: string; date: string }

interface ICopyingTimetableModalProps {
  open: boolean
  groupId: number | null
  setOpen: Dispatch<SetStateAction<boolean>>
}

const CopyingTimetableModal: FC<ICopyingTimetableModalProps> = ({ open, setOpen, groupId }) => {
  const dispatch = useAppDispatch()

  const {
    timetable: { semester },
  } = useSelector(generalSelector)
  const { settings } = useSelector(settingsSelector)

  const [activeTab, setActiveTab] = useState<"week" | "day">("week")
  const [weeks, setWeeks] = useState<CopingWeekType[]>([])
  const [copyDates, setCopyDates] = useState({ copyFrom: "", copyTo: "" })

  const handleTabChange = (newValue: string) => {
    setCopyDates({ copyFrom: "", copyTo: "" })
    setActiveTab(newValue as "week" | "day")
  }

  const onCopySchedule = () => {
    if (!groupId) return
    if (!copyDates.copyFrom || !copyDates.copyTo) return

    const start = customDayjs(copyDates.copyFrom, "DD.MM.YYYY").format("MM.DD.YYYY")
    const end = customDayjs(copyDates.copyTo, "DD.MM.YYYY").format("MM.DD.YYYY")

    try {
      if (activeTab === "week") {
        const payload = { groupId, copyFromStartDay: start, copyToStartDay: end }
        dispatch(copyWeekSchedule(payload))
      }

      if (activeTab === "day") {
        const payload = { groupId, copyFromDay: start, copyToDay: end }
        dispatch(copyDaySchedule(payload))
      }
    } catch (err) {
      console.log(err)
    } finally {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!settings) return
    if (semester !== 1 && semester !== 2) return

    let semesterStart
    let semesterEnd

    if (semester === 1) {
      semesterStart = settings.firstSemesterStart
      semesterEnd = settings.firstSemesterEnd
    }

    if (semester === 2) {
      semesterStart = settings.secondSemesterStart
      semesterEnd = settings.secondSemesterEnd
    }

    // Перетворюємо рядки дат у об'єкти dayjs
    const startDate = customDayjs(semesterStart, "MM.DD.YYYY")
    const endDate = customDayjs(semesterEnd, "MM.DD.YYYY")

    // Визначаємо кількість тижнів між початковою та кінцевою датами
    const weeksCount = endDate.diff(startDate, "week") + 1

    // Створюємо масив об'єктів для зберігання даних
    const weeklyData = []

    // Проходимо по кожному тижню
    for (let i = 0; i < weeksCount; i++) {
      // Визначаємо початок та кінець поточного тижня
      const weekStart = startDate.add(i, "week").startOf("week")
      const weekEnd = startDate.add(i, "week").endOf("week")

      // Додаємо об'єкт з даними про поточний тиждень в масив
      weeklyData.push({
        weekNumber: i + 1,
        dateRange: `${weekStart.format("DD.MM")} - ${weekEnd.format("DD.MM")}`,
        date: weekStart.format("MM.DD.YYYY"),
      })
    }

    // Виводимо результат
    setWeeks(weeklyData)
  }, [semester, settings])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-4 gap-0 w-100">
        <AlertDialogHeader className="pb-2 px-4">
          <DialogTitle className="mb-2">Копіювати розклад</DialogTitle>
        </AlertDialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col mb-4">
          <Tabs defaultValue="week" className="" onValueChange={(value) => handleTabChange(value)}>
            <TabsList className="w-full">
              <TabsTrigger value="week" className="border-0 border-b">
                Копіювати тиждень
              </TabsTrigger>
              <TabsTrigger value="day" className="border-0 border-b">
                Копіювати день
              </TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="flex p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
              <div className="flex flex-col gap-4 w-[50%]">
                <p className="opacity-[0.7]">Копіювати з:</p>
                <RadioGroup value={copyDates.copyFrom}>
                  {weeks.map((el) => (
                    <div
                      key={el.weekNumber}
                      className="flex items-center space-x-2 mb-1"
                      onClick={() => {
                        if (copyDates.copyTo !== el.date) {
                          setCopyDates((prev) => ({ ...prev, copyFrom: el.date }))
                        }
                      }}
                    >
                      <RadioGroupItem value={el.date} />
                      <Label
                        className={cn(
                          copyDates.copyFrom === el.date ? "text-primary" : "",
                          copyDates.copyTo === el.date ? "text-default opacity-[0.3]" : "",
                        )}
                      >
                        {el.weekNumber}) {el.dateRange}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-4 w-[50%]">
                <p className="opacity-[0.7]">Копіювати на:</p>
                <RadioGroup className="pl-4" value={copyDates.copyTo}>
                  {weeks.map((el) => (
                    <div
                      key={el.weekNumber}
                      className="flex items-center gap-2 mb-1"
                      onClick={() => {
                        if (copyDates.copyFrom !== el.date) {
                          setCopyDates((prev) => ({ ...prev, copyTo: el.date }))
                        }
                      }}
                    >
                      <RadioGroupItem value={el.date} />
                      <Label
                        className={cn(
                          copyDates.copyTo === el.date ? "text-primary" : "",
                          copyDates.copyFrom === el.date ? "text-default opacity-[0.3]" : "",
                        )}
                      >
                        {el.weekNumber}) {el.dateRange}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="day" className="px-4 py-8">
              <InputCalendar
                label="Копіювати з"
                classNames="pb-4"
                value={copyDates.copyFrom}
                onValueChange={(date) => setCopyDates((prev) => ({ ...prev, copyFrom: date }))}
              />
              <InputCalendar
                label="Копіювати на"
                value={copyDates.copyTo}
                onValueChange={(date) => setCopyDates((prev) => ({ ...prev, copyTo: date }))}
              />
            </TabsContent>
          </Tabs>
        </DialogDescription>

        <DialogFooter className="px-4 !items-center !justify-between">
          <p>
            {copyDates.copyFrom && copyDates.copyTo
              ? `Копіювати з ${copyDates.copyFrom.split(".")[0]}.${copyDates.copyFrom.split(".")[1]} 
            на ${copyDates.copyTo.split(".")[0]}.${copyDates.copyTo.split(".")[1]}`
              : ""}
          </p>
          <Button onClick={onCopySchedule} disabled={!copyDates.copyFrom || !copyDates.copyTo}>
            Копіювати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CopyingTimetableModal
