import { Search } from "lucide-react"
import { useSelector } from "react-redux"
import { useEffect, useMemo, useState, type FC } from "react"

import { useAppDispatch } from "@/store/store"
import { Card } from "@/components/ui/common/card"
import { Button } from "@/components/ui/common/button"
import { groupsSelector } from "@/store/groups/groups-slice"
import { SEMESTERS_LIST, HALF_YEARS_LIST } from "@/constants"
import type { GroupLoadType } from "@/store/groups/groups-types"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import type { GroupsShortType } from "@/store/groups/groups-types"
import { Autocomplete } from "@/components/ui/custom/autocomplete"
import { PageTopTitle } from "@/components/features/page-top-title"
import { RootContainer } from "@/components/layouts/root-container"
import DropdownSelect from "@/components/ui/custom/dropdown-select"
import type { TeachersType } from "@/store/teachers/teachers-types"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"
import { getGroupCategories } from "@/store/groups/groups-async-actions"
import { Table, TableCell, TableRow } from "@/components/ui/common/table"
import { getTeachersCategories } from "@/store/teachers/teachers-async-actions"
import { getTeacherLoadById } from "@/store/teacher-profile/teacher-profile-async-actions"
import { findGroupLoadLessonsByGroupIdAndSemester } from "@/store/groups/groups-async-actions"

const ViewDistributionLoadPage: FC = () => {
  const dispatch = useAppDispatch()

  const { groupCategories } = useSelector(groupsSelector)
  const { teachersCategories } = useSelector(teachersSelector)

  const groupsList = useMemo(() => (groupCategories || []).flatMap((el) => el.groups), [groupCategories])
  const teachersList = useMemo(() => (teachersCategories || []).flatMap((el) => el.teachers), [teachersCategories])

  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<TeachersType | null>(null)

  const [tableData, setTableData] = useState<GroupLoadType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(getGroupCategories())
    dispatch(getTeachersCategories())
  }, [])

  const handleFind = async () => {
    if (!selectedSemester) return

    setLoading(true)
    setTableData([])

    try {
      if (selectedTeacher) {
        const { payload } = await dispatch(getTeacherLoadById(selectedTeacher.id))
        const data = payload as GroupLoadType[]

        const filteredData = data.filter((el) => {
          if (selectedSemester === 1) {
            return [1, 3, 5, 7].includes(el.semester)
          }
          return [2, 4, 6, 8].includes(el.semester)
        })

        setTableData(filteredData)
      } else if (selectedGroup) {
        const { payload } = await dispatch(
          findGroupLoadLessonsByGroupIdAndSemester({
            groupId: selectedGroup.id,
            semester: selectedSemester,
          }),
        )
        setTableData(payload as GroupLoadType[])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <RootContainer classNames="relative">
      <div className="flex flex-col 2xl:flex-row justify-between items-center mb-4 gap-4 md:gap-0">
        <PageTopTitle
          title="Перегляд навантаження"
          description="Перегляд навантаження, по циклових комісіях та групах, за півріччя"
          classNames="text-center mb-6 2xl:mb-0 2xl:text-left [&_h2]:text-xl sm:[&_h2]:text-2xl md:[&_h2]:text-3xl"
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full md:w-auto">
          <Autocomplete
            label="Група"
            items={groupsList}
            selectedItem={selectedGroup?.id}
            classNames="w-full md:w-[200px]"
            onChange={(item) => {
              if (item === null) {
                setSelectedGroup(null)
                return
              }
              const selectedGroup = groupsList.find((el) => el.id === item)
              if (selectedGroup) setSelectedGroup(selectedGroup)
            }}
          />

          <Autocomplete
            label="Викладач"
            items={useMemo(
              () => (teachersList || []).map((el) => ({ id: el.id, name: getTeacherFullname(el, "short") })),
              [teachersList],
            )}
            selectedItem={selectedTeacher?.id}
            classNames="w-full md:w-[200px]"
            onChange={(item) => {
              if (item === null) {
                setSelectedTeacher(null)
                return
              }
              const selectedTeacher = teachersList.find((el) => el.id === item)
              if (selectedTeacher) setSelectedTeacher(selectedTeacher)
            }}
          />

          <DropdownSelect
            label={selectedTeacher ? "Півріччя" : "Семестр"}
            classNames="w-full md:w-30"
            items={selectedTeacher ? HALF_YEARS_LIST : SEMESTERS_LIST}
            selectedItem={selectedSemester}
            onChange={(item) => setSelectedSemester(item)}
          />

          <Button
            className="w-full md:w-auto"
            onClick={handleFind}
            disabled={loading || !selectedSemester || (!selectedGroup && !selectedTeacher)}
          >
            <Search />
            Знайти
          </Button>
        </div>
      </div>

      <Card className="py-4 px-2 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <Table>
            <TableRow>
              <TableCell className="font-mono uppercase">№</TableCell>
              <TableCell className="font-mono uppercase">Група</TableCell>
              <TableCell className="font-mono uppercase">Дисципліна</TableCell>
              <TableCell className="font-mono uppercase">Викладач</TableCell>
              <TableCell className="font-mono uppercase">Група/Підгрупа</TableCell>
              <TableCell className="font-mono uppercase">Вид заняття</TableCell>
              <TableCell className="font-mono uppercase text-right">Години</TableCell>
            </TableRow>
            {tableData.length > 0 ? (
              tableData.map((lesson, index) => {
                const subgroup = lesson.subgroupNumber ? `Підгр.${lesson.subgroupNumber}` : "Вся група"
                const teacherName = lesson.teacher ? getTeacherFullname(lesson.teacher, "short") : "-"

                return (
                  <TableRow key={lesson.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lesson.group.name}</TableCell>
                    <TableCell>{lesson.name}</TableCell>
                    <TableCell>{teacherName}</TableCell>
                    <TableCell>{subgroup}</TableCell>
                    <TableCell>{lesson.typeRu}</TableCell>
                    <TableCell className="text-right">{lesson.hours}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  Дані відсутні
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </Card>
    </RootContainer>
  )
}

export default ViewDistributionLoadPage
