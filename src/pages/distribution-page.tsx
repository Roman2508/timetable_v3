import { useState } from "react"
import { useSelector } from "react-redux"
import { GraduationCap } from "lucide-react"

import { Card } from "@/components/ui/common/card"
import { sortByName } from "@/helpers/sort-by-name"
import EntityHeader from "@/components/features/entity-header"
import { InputSearch } from "@/components/ui/custom/input-search"
import type { GroupsShortType } from "@/store/groups/groups-types"
import { teachersSelector } from "@/store/teachers/teachers-slice"
import { RootContainer } from "@/components/layouts/root-container"
import { PopoverFilter } from "@/components/ui/custom/popover-filter"
import type { DistributionLessonType } from "@/helpers/get-lesson-for-distribution"
import SelectGroupModal from "@/components/features/select-group/select-group-modal"
import DistributionActions from "@/components/features/pages/distribution/distribution-actions"
import { DistributionTeacherTable } from "@/components/features/pages/distribution/distribution-teacher-table"
import { DistributionLessonsTable } from "@/components/features/pages/distribution/distribution-lessons-table"

const DistributionPage = () => {
  const { teachersCategories } = useSelector(teachersSelector)

  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null)
  const [selectedSemesters, setSelectedSemesters] = useState<{ id: number; name: string }[]>([])
  const [availableSemesters, setAvailableSemesters] = useState<{ id: number; name: string }[]>([])

  const defaultSelected = teachersCategories ? teachersCategories.map((el) => ({ id: el.id })) : []
  const [selectedTeacherCategories, setSelectedTeacherCategories] = useState<{ id: number }[]>(defaultSelected)

  const [searchLesson, setSearchLesson] = useState("")
  const [searchTeacher, setSearchTeacher] = useState("")

  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<DistributionLessonType | null>(null)

  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {selectedGroup ? (
            <EntityHeader label="ГРУПА" name={selectedGroup.name} status={selectedGroup.status} Icon={GraduationCap} />
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для розподілу навантаження</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <SelectGroupModal setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch
              className="w-full"
              value={searchLesson}
              placeholder="Знайти..."
              onChange={(e) => setSearchLesson(e.target.value)}
            />

            <PopoverFilter
              enableSelectAll
              itemsPrefix="Семестр"
              disabled={!selectedGroup}
              items={availableSemesters}
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSemesters}
              setSelectedItems={setSelectedSemesters}
            />
          </div>

          <DistributionLessonsTable
            globalFilter={searchLesson}
            selectedGroup={selectedGroup}
            selectedLesson={selectedLesson}
            setGlobalFilter={setSearchLesson}
            setSelectedLesson={setSelectedLesson}
            selectedSemesters={selectedSemesters}
            setSelectedSemesters={setSelectedSemesters}
            setAvailableSemesters={setAvailableSemesters}
          />
        </Card>

        <Card className="p-3 flex-1 gap-0">
          <DistributionActions
            selectedLesson={selectedLesson}
            selectedTeacherId={selectedTeacherId}
            setSelectedLesson={setSelectedLesson}
          />
        </Card>

        <Card className="p-3 flex-1 h-[calc(100vh-240px)]">
          <div className="flex gap-4 justify-between">
            <InputSearch
              className="w-full"
              value={searchTeacher}
              placeholder="Знайти..."
              onChange={(e) => setSearchTeacher(e.target.value)}
            />

            <PopoverFilter
              itemsPrefix=""
              enableSelectAll
              filterVariant="outline"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedTeacherCategories}
              items={sortByName(teachersCategories) || []}
              setSelectedItems={setSelectedTeacherCategories}
            />
          </div>
          {selectedTeacherCategories.length ? (
            <DistributionTeacherTable
              globalFilter={searchTeacher}
              setGlobalFilter={setSearchTeacher}
              selectedTeacherId={selectedTeacherId}
              setSelectedTeacherId={setSelectedTeacherId}
              selectedTeacherCategories={selectedTeacherCategories}
            />
          ) : (
            <p className="font-mono text-center py-10">Пусто</p>
          )}
        </Card>
      </div>
    </RootContainer>
  )
}

export default DistributionPage
