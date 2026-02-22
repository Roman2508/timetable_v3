import { useSelector } from "react-redux"
import { ChevronsUpDown, CircleX, CopyX, UserMinus, UserPlus } from "lucide-react"
import { useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react"

import {
  addStudentToLesson,
  deleteStudentFromLesson,
  addStudentsToAllGroupLessons,
  deleteStudentsFromAllGroupLessons,
  getLessonStudents,
} from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { Button } from "@/components/ui/common/button"
import { groupLessonsByFields } from "@/helpers/group-lessons-by-fields"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import type { GroupLoadType, GroupsShortType } from "@/store/groups/groups-types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import { lessonsForGradeBookSelector } from "@/store/schedule-lessons/schedule-lessons-slice"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/common/collapsible"

const lessonsTabs = [
  {
    icon: <CopyX />,
    label: "Одна дисципліна",
    name: "one",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CircleX />,
    label: "Всі дисципліни",
    name: "all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
] as const

interface IStudentsDivideLessonsProps {
  studentsToAdd: string[]
  studentsToDelete: string[]
  dividingType: "all" | "one"
  selectedSemester: number | null
  selectedLesson: GroupLoadType | null
  selectedGroup: GroupsShortType | null
  setDividingType: Dispatch<SetStateAction<"all" | "one">>
  isActionButtonsDisabled: { add: boolean; delete: boolean }
  setSelectedLesson: Dispatch<SetStateAction<GroupLoadType | null>>
  setIsActionButtonsDisabled: Dispatch<SetStateAction<{ add: boolean; delete: boolean }>>
}

const StudentsDivideLessons: FC<IStudentsDivideLessonsProps> = ({
  dividingType,
  studentsToAdd,
  selectedGroup,
  selectedLesson,
  setDividingType,
  selectedSemester,
  studentsToDelete,
  setSelectedLesson,
  isActionButtonsDisabled,
  setIsActionButtonsDisabled,
}) => {
  const dispatch = useAppDispatch()

  const { lessons } = useSelector(lessonsForGradeBookSelector)

  const groupLoadLessons = useMemo(() => groupLessonsByFields(lessons, { lessonName: true }), [lessons])

  const onAddStudentsToLesson = async () => {
    try {
      if (!selectedLesson) return alert("Виберіть дисципліну")
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: true }))
      const studentIds = studentsToAdd.map((el) => Number(el))
      await dispatch(addStudentToLesson({ lessonId: selectedLesson.id, studentIds }))
    } catch (error) {
      console.log(error)
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: false }))
    }
  }

  const onAddStudentsToAllGroupLessons = async () => {
    try {
      if (!selectedGroup || !selectedSemester) return alert("Виберіть групу та семестр")
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: true }))
      const studentIds = studentsToAdd.map((el) => Number(el))
      const payload = { groupId: selectedGroup.id, semester: selectedSemester, studentIds }
      await dispatch(addStudentsToAllGroupLessons(payload))
    } catch (error) {
      console.log(error)
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, add: false }))
    }
  }

  const onDeleteStudentsFromLesson = async () => {
    try {
      if (!selectedLesson) return alert("Виберіть дисципліну")
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: true }))
      const studentIds = studentsToDelete.map((el) => Number(el))
      await dispatch(deleteStudentFromLesson({ lessonId: selectedLesson.id, studentIds }))
    } catch (error) {
      console.log(error)
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: false }))
    }
  }

  const onDeleteStudentsFromAllGroupLessons = async () => {
    try {
      if (!selectedGroup || !selectedSemester) return alert("Виберіть групу та семестр")
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: true }))
      const studentIds = studentsToDelete.map((el) => Number(el))
      await dispatch(
        deleteStudentsFromAllGroupLessons({ groupId: selectedGroup.id, semester: selectedSemester, studentIds }),
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsActionButtonsDisabled((prev) => ({ ...prev, delete: false }))
    }
  }

  const handleSelectLesson = async (id: number) => {
    try {
      await dispatch(getLessonStudents(id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex-1">
      <Card className="mb-3 p-0 gap-0 flex-row items-center h-10">
        <Tooltip delayDuration={500}>
          <TooltipTrigger className="flex-1">
            <Button
              variant="ghost"
              className="w-full"
              disabled={isActionButtonsDisabled.add || !studentsToAdd.length}
              onClick={() => {
                if (dividingType === "one") onAddStudentsToLesson()
                if (dividingType === "all") onAddStudentsToAllGroupLessons()
              }}
            >
              <UserPlus />
              Зарахувати
            </Button>
          </TooltipTrigger>
          <TooltipContent>Зарахувати вибраних студентів на дисципліну</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={500}>
          <TooltipTrigger className="flex-1">
            <Button
              variant="ghost"
              className="w-full"
              disabled={isActionButtonsDisabled.delete || !studentsToDelete.length}
              onClick={() => {
                if (dividingType === "one") onDeleteStudentsFromLesson()
                if (dividingType === "all") onDeleteStudentsFromAllGroupLessons()
              }}
            >
              <UserMinus />
              Відрахувати
            </Button>
          </TooltipTrigger>
          <TooltipContent>Відрахувати вибраних студентів з дисципліни</TooltipContent>
        </Tooltip>
      </Card>

      <div className="flex gap-2 mb-3 w-full">
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setDividingType(value as "all" | "one")}>
          <TabsList className="w-full h-[40px]">
            {lessonsTabs.map((el) => (
              <TabsTrigger key={el.name} value={el.name} className="w-full flex-1" disabled={!lessons.length}>
                {el.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card className="pt-3 flex-1 h-[calc(100vh-343px)]">
        <div className="overflow-y-auto overflow-x-hidden pr-3">
          {groupLoadLessons.map((lesson) => (
            <Collapsible className="space-y-2" disabled={dividingType === "all"}>
              <div className="flex items-center justify-between space-x-4 pl-4">
                <h4
                  className={cn("text-sm font-semibold", dividingType === "all" ? "opacity-[0.5] cursor-default" : "")}
                >
                  {lesson[0].name}
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="space-y-2 mb-4 ml-4">
                {lesson.map((type) => {
                  const unitInfo = type.subgroupNumber ? `${type.subgroupNumber} підгрупа` : "Вся група"

                  return (
                    <div
                      className={cn(
                        "border px-4 py-2 font-mono text-sm cursor-pointer",
                        type.id === selectedLesson?.id ? "border-primary text-primary" : "",
                      )}
                      onClick={() => {
                        if (selectedLesson?.id !== type.id) {
                          handleSelectLesson(type.id)
                          setSelectedLesson(type)
                        }
                      }}
                    >
                      {`${type.typeRu}. ${type.name} (${unitInfo})`}
                    </div>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default StudentsDivideLessons
