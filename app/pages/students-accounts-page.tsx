import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { GraduationCap, Plus } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router"

import { useAppDispatch } from "~/store/store"
import { Button } from "~/components/ui/common/button"
import { groupsSelector } from "~/store/groups/groups-slice"
import EntityHeader from "~/components/features/entity-header"
import { useItemsByStatus } from "~/hooks/use-items-by-status"
import { InputSearch } from "~/components/ui/custom/input-search"
import type { StudentType } from "~/store/students/students-types"
import type { GroupsShortType } from "~/store/groups/groups-types"
import { RootContainer } from "~/components/layouts/root-container"
import type { StudentsStatusType } from "~/store/general/general-types"
import { getGroupCategories } from "~/store/groups/groups-async-actions"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs"
import { getStudentsByGroupId } from "~/store/students/students-async-actions"
import { clearStudents, studentsSelector } from "~/store/students/students-slice"
import { generalSelector, setStudentsStatus } from "~/store/general/general-slice"
import SelectGroupModal from "~/components/features/select-group/select-group-modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip"
import AccountsHelperModal from "~/components/features/pages/students-accounts/accounts-helper-modal"
import DeleteStudentsAccounts from "~/components/features/pages/students-accounts/delete-students-accounts"
import ImportStudentsAccounts from "~/components/features/pages/students-accounts/import-students-accounts"
import ExportStudentsAccounts from "~/components/features/pages/students-accounts/export-students-accounts"
import UpdateStudentsAccounts from "~/components/features/pages/students-accounts/update-students-accounts"
import { StudentsAccountsTable } from "~/components/features/pages/students-accounts/students-accounts-table"

const StudentsAccountsPage = () => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    students: { status: defaultStatus },
  } = useSelector(generalSelector)
  const { students } = useSelector(studentsSelector)
  const { groupCategories } = useSelector(groupsSelector)

  const [isLoading, setIsLoading] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")
  const [helperModalOpen, setHelperModalOpen] = useState(false)
  const [studentsIdsToDelete, setStudentsIdsToDelete] = useState<number[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null)
  const [actionMode, setActionMode] = useState<"create" | "update" | "delete">("create")
  const [activeStatus, setActiveStatus] = useState<StudentsStatusType>(defaultStatus || "Всі")

  const { filteredItems, counts } = useItemsByStatus<{ students: StudentType[] }, "students", StudentType, "students">(
    [{ students: students || [] }],
    "students",
    activeStatus,
    "students",
  )

  const handleAddStudentToDelete = (id: number) => {
    setStudentsIdsToDelete((prev) => {
      if (prev.includes(id)) {
        return prev.filter((studentId) => studentId !== id)
      }
      return [...prev, id]
    })
  }

  const changeActiveStatus = (value: string) => {
    setActiveStatus(value as StudentsStatusType)
  }

  useEffect(() => {
    if (!selectedGroup) return
    setSearchParams({ group: String(selectedGroup.id) })
  }, [selectedGroup])

  useEffect(() => {
    dispatch(clearStudents())
    const groupId = searchParams.get("group")

    if (!groupId) return
    ;(async function () {
      try {
        setIsLoading(true)
        await dispatch(getStudentsByGroupId(+groupId))
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    })()

    if (groupCategories) {
      const group = groupCategories.flatMap((el) => el.groups).find((el) => el.id === +groupId)

      if (group) {
        setSelectedGroup(group)
      }
    }

    return () => {
      dispatch(clearStudents())
    }
  }, [searchParams, groupCategories])

  useEffect(() => {
    if (groupCategories) return
    dispatch(getGroupCategories())
  }, [])

  useEffect(() => {
    dispatch(setStudentsStatus(activeStatus))
  }, [activeStatus])

  return (
    <>
      <AccountsHelperModal open={helperModalOpen} setOpen={setHelperModalOpen} />

      <RootContainer>
        <div className="flex justify-between items-center mb-6">
          <div className="">
            {selectedGroup ? (
              <EntityHeader
                label="ГРУПА"
                name={selectedGroup.name}
                status={selectedGroup.status}
                Icon={GraduationCap}
              />
            ) : (
              <div className="flex items-center h-[56px]">
                <h2 className="text-lg font-semibold">Виберіть групу для перегляду студентів</h2>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {selectedGroup && (
              <>
                <DeleteStudentsAccounts
                  actionMode={actionMode}
                  setActionMode={setActionMode}
                  studentsIdsToDelete={studentsIdsToDelete}
                  setStudentsIdsToDelete={setStudentsIdsToDelete}
                />
                <ImportStudentsAccounts setHelperModalOpen={setHelperModalOpen} />
                <ExportStudentsAccounts selectedGroup={selectedGroup} />
                <UpdateStudentsAccounts />

                <Tooltip delayDuration={500}>
                  <TooltipTrigger>
                    <Button variant="outline" onClick={() => navigate("/students/create")}>
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Додати нового студента до групи</TooltipContent>
                </Tooltip>
              </>
            )}

            <SelectGroupModal selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
          </div>
        </div>

        <Tabs className="mb-4" defaultValue={activeStatus} onValueChange={(value) => changeActiveStatus(value)}>
          <TabsList>
            <TabsTrigger value="Всі">Всі ({counts.all})</TabsTrigger>
            <TabsTrigger value="Навчається">Навчається ({counts.studying})</TabsTrigger>
            <TabsTrigger value="Відраховано">Відраховано ({counts.expelled})</TabsTrigger>
            <TabsTrigger value="Академічна відпустка">Академічна відпустка ({counts.academicLeave})</TabsTrigger>
          </TabsList>
        </Tabs>

        <InputSearch
          value={globalFilter}
          className="w-full mb-6"
          placeholder="Знайти..."
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <StudentsAccountsTable
          isLoading={isLoading}
          actionMode={actionMode}
          students={filteredItems}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          studentsIdsToDelete={studentsIdsToDelete}
          setStudentsIdsToDelete={setStudentsIdsToDelete}
          handleAddStudentToDelete={handleAddStudentToDelete}
        />
      </RootContainer>
    </>
  )
}

export default StudentsAccountsPage
