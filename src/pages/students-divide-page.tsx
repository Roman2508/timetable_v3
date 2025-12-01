import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { ChevronsUpDown, CircleX, CopyX, GraduationCap, UserMinus, UserPlus } from "lucide-react"

import {
  addStudentToLesson,
  deleteStudentFromLesson,
  addStudentsToAllGroupLessons,
  deleteStudentsFromAllGroupLessons,
  findGroupLoadLessonsByGroupIdAndSemester,
} from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { Badge } from "@/components/ui/common/badge"
import { Button } from "@/components/ui/common/button"
import { clearGroupData, groupsSelector } from "@/store/groups/groups-slice"
import { RootContainer } from "@/components/layouts/root-container"
import DropdownSelect from "@/components/ui/custom/dropdown-select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/common/tabs"
import type { GroupLoadType, GroupsShortType } from "@/store/groups/groups-types"
import SelectGroupModal from "@/components/features/select-group/select-group-modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import {
  clearGroupLoad,
  clearLessonStudents,
  scheduleLessonsSelector,
} from "@/store/schedule-lessons/schedule-lessons-slice"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/common/collapsible"
import { sortByName } from "@/helpers/sort-by-name"
import EntityHeader from "@/components/features/entity-header"
import { getGroup } from "@/store/groups/groups-async-actions"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import StudentsDivideLessons from "@/components/features/pages/students-divide/students-divide-lessons"
import type { StudentType } from "@/store/students/students-types"
import { LoadingStatusTypes } from "@/store/app-types"
import { SEMESTERS_LIST } from "@/constants"

const StudentsDividePage = () => {
  const dispatch = useAppDispatch()

  const { group, groupCategories } = useSelector(groupsSelector)
  const { lessonStudents, loadingStatus } = useSelector(scheduleLessonsSelector)

  const groupsList = useMemo(() => (groupCategories || []).flatMap((el) => el.groups), [groupCategories])

  const [isLoading, setIsLoading] = useState(false)
  const [studentsToAdd, setStudentsToAdd] = useState<string[]>([])
  const [openedLessonsIds, setOpenedLessonsIds] = useState<string[]>([])
  const [studentsToDelete, setStudentsToDelete] = useState<string[]>([])
  const [dividingType, setDividingType] = useState<"all" | "one">("all")
  const [selectedLesson, setSelectedLesson] = useState<GroupLoadType | null>(null)
  const [isActionButtonsDisabled, setIsActionButtonsDisabled] = useState({ add: false, delete: false })

  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null)

  const selectedLessonText = selectedLesson
    ? `${selectedLesson.typeRu}. ${selectedLesson.name} ${
        selectedLesson.subgroupNumber ? `(підгрупа ${selectedLesson.subgroupNumber})` : "(вся група)"
      }`
    : ""

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>, type: "add" | "delete") => {
    const { options } = event.target
    const value: string[] = []
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    if (type === "add") setStudentsToAdd(value)
    if (type === "delete") setStudentsToDelete(value)
  }

  const fetchGroupData = async () => {
    if (!selectedGroup || !selectedSemester) return
    try {
      setIsLoading(true)
      setStudentsToAdd([])
      setDividingType("all")
      setSelectedLesson(null)
      setOpenedLessonsIds([])
      dispatch(clearGroupData())
      dispatch(clearGroupLoad())
      dispatch(clearLessonStudents())

      await dispatch(
        findGroupLoadLessonsByGroupIdAndSemester({ semester: selectedSemester, groupId: selectedGroup.id }),
      )

      // !important
      // CREATE GET_GROUP_SHORT METHOD AND REPLACE THIS:
      await dispatch(getGroup(String(selectedGroup.id)))
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RootContainer classNames="max-h-[calc(100vh-160px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {group.id ? (
            <EntityHeader Icon={GraduationCap} label="ГРУПА" name={group.name} status={group.status} />
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-2xl font-bold tracking-tight">Виберіть групу для розподілу студентів</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <DropdownSelect
            label="Група"
            sortBy="name"
            classNames="w-40"
            items={groupsList}
            selectedItem={selectedGroup?.id}
            onChange={(item) => {
              const selectedGroup = groupsList.find((el) => el.id === item)
              if (selectedGroup) setSelectedGroup(selectedGroup)
            }}
          />

          <DropdownSelect
            label="Семестр"
            classNames="w-30"
            items={SEMESTERS_LIST}
            selectedItem={selectedSemester}
            onChange={(item) => setSelectedSemester(item)}
          />

          <Button disabled={!selectedGroup || !selectedSemester} onClick={fetchGroupData}>
            Знайти
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-3 !h-[calc(100vh-240px)]">
        <Card className="p-3 pr-0 flex-1">
          {isLoading ? (
            <LoadingSpinner classNames="mt-10" />
          ) : group.id ? (
            <>
              <h3 className="font-semibold">Студенти групи {group.name}</h3>

              <select
                multiple
                value={studentsToAdd}
                className="h-full border-0 outline-0"
                onChange={(e) => handleChangeMultiple(e, "add")}
              >
                {sortByName(group.students).map((student, index) => (
                  <option key={student.id} value={student.id} style={{ padding: "2px 0" }}>
                    {`${index + 1}. ${student.name}`}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="font-mono text-center py-4">Виберіть групу</p>
          )}
        </Card>

        <StudentsDivideLessons
          dividingType={dividingType}
          studentsToAdd={studentsToAdd}
          selectedGroup={selectedGroup}
          selectedLesson={selectedLesson}
          setDividingType={setDividingType}
          selectedSemester={selectedSemester}
          studentsToDelete={studentsToDelete}
          setSelectedLesson={setSelectedLesson}
          isActionButtonsDisabled={isActionButtonsDisabled}
          setIsActionButtonsDisabled={setIsActionButtonsDisabled}
        />

        <Card className="p-3 pr-0 flex-1">
          {isLoading && <LoadingSpinner classNames="mt-10" />}

          {!group.id && !isLoading && <p className="font-mono text-center py-4">Виберіть групу</p>}

          {!isLoading && !!group.id && (
            <h3 className="font-semibold">
              {selectedLesson
                ? `${selectedLesson.typeRu}. ${selectedLesson.name} 
                  ${selectedLesson.subgroupNumber ? `(${selectedLesson.subgroupNumber} підгрупа)` : "(вся група)"}`
                : dividingType === "one"
                ? "Виберіть дисципліну"
                : "Всі дисципліни"}
            </h3>
          )}

          {!isLoading &&
            dividingType === "one" &&
            !lessonStudents?.length &&
            loadingStatus !== LoadingStatusTypes.LOADING &&
            selectedLesson && <p className="font-mono text-center py-4">Студенти не зараховані на дисципліну</p>}

          {!isLoading && lessonStudents && (
            <select
              multiple
              value={studentsToDelete}
              className="h-full border-0 outline-0"
              onChange={(e) => handleChangeMultiple(e, "delete")}
            >
              {sortByName(dividingType === "all" ? group.students : lessonStudents ? lessonStudents : []).map(
                (student, index) => (
                  <option key={student.id} value={student.id} style={{ padding: "2px 0" }}>
                    {`${index + 1}. ${student.name}`}
                  </option>
                ),
              )}
            </select>
          )}

          {/* {isLoading ? (
            <LoadingSpinner classNames="mt-10" />
          ) : group.id ? (
            <>
              <h3 className="font-semibold">
                {selectedLesson
                  ? `${selectedLesson.typeRu}. ${selectedLesson.name} 
                  ${selectedLesson.subgroupNumber ? `(${selectedLesson.subgroupNumber} підгрупа)` : "(вся група)"}`
                  : "Всі дисципліни"}
              </h3>

              <select
                multiple
                value={studentsToDelete}
                className="h-full border-0 outline-0"
                onChange={(e) => handleChangeMultiple(e, "delete")}
              >
                {sortByName(dividingType === "all" ? group.students : lessonStudents ? lessonStudents : []).map(
                  (student, index) => (
                    <option key={student.id} value={student.id} style={{ padding: "2px 0" }}>
                      {`${index + 1}. ${student.name}`}
                    </option>
                  ),
                )}
              </select>
            </>
          ) : (
            <p className="font-mono text-center py-4">Виберіть групу</p>
          )} */}
        </Card>
      </div>
    </RootContainer>
  )
}

export default StudentsDividePage
