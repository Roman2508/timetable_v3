import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { ChevronDown, GraduationCap, Layers, Search, Users } from "lucide-react"

import CategoryActionsModal, {
  type FormData,
} from "@/components/features/category-actions-modal/category-actions-modal"
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "@/components/features/category-actions-modal/category-actions-modal-types"
import { useAppDispatch } from "@/store/store"
import { Badge } from "@/components/ui/common/badge"
import { Button } from "@/components/ui/common/button"
import EntityHeader from "@/components/features/entity-header"
import type { StreamsType } from "@/store/streams/streams-types"
import { InputSearch } from "@/components/ui/custom/input-search"
import type { GroupsShortType } from "@/store/groups/groups-types"
import { RootContainer } from "@/components/layouts/root-container"
import { PageTopTitle } from "@/components/features/page-top-title"
import { PopoverFilter } from "@/components/ui/custom/popover-filter"
import type { StreamLessonType } from "@/helpers/group-lessons-by-streams"
import { generalSelector, setStreamFilters } from "@/store/general/general-slice"
import SelectGroupModal from "@/components/features/select-group/select-group-modal"
import StreamsListDrawer from "@/components/features/pages/streams/streams-list-drawer"
import { StreamsLessonsTable } from "@/components/features/pages/streams/streams-lessons-table"
import StreamLessonDetailsModal from "@/components/features/pages/streams/stream-lesson-details-modal"
import CombineStreamLessonsModal from "@/components/features/pages/streams/combine-stream-lessons-modal"
import { addGroupToStream, createStream, getStreams, updateStream } from "@/store/streams/streams-async-actions"
import { Input } from "@/components/ui/common/input"
import StreamSelector from "@/components/features/streams/stream-selector"
import ManageStreamGroups from "@/components/features/streams/manage-stream-groups"

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
]

const StreamsPage = () => {
  const dispatch = useAppDispatch()

  const {
    streams: { semesters: defaultSelectedSemesters },
  } = useSelector(generalSelector)

  const [selectedSemester, setSelectedSemester] = useState(
    defaultSelectedSemesters.length
      ? defaultSelectedSemesters.split(",").map((sem: (typeof semesters)[number]) => ({ id: Number(sem), name: sem }))
      : semesters,
  )

  const [selectStreamPopoverOpen, setSelectStreamPopoverOpen] = useState(false)
  const [manageStreamGroupsOpen, setManageStreamGroupsOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isCombineModalOpen, setIsCombineModalOpen] = useState(false)
  const [selectedStream, setSelectedStream] = useState<StreamsType | null>(null)
  const [selectedLessons, setSelectedLessons] = useState<StreamLessonType[]>([])
  const [preSelectedStream, setPreSelectedStream] = useState<StreamsType | null>(null)
  const [updatingStream, setUpdatingStream] = useState<UpdatingCategoryType | null>(null)
  const [selectedLessonFromDetails, setSelectedLessonFromDetails] = useState<StreamLessonType | null>(null)
  const [modalData, setModalData] = useState<CategoryModalStateType>({ isOpen: false, actionType: "create" })

  const [isSelectGroupModalOpen, setIsSelectGroupModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null)
  const [selectedStreamIdToAddGroup, setSelectedStreamIdToAddGroup] = useState<number | null>(null)

  const onCreateStream = async (data: FormData) => {
    try {
      await dispatch(createStream({ name: data.name }))
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateStream = async (data: FormData & { id: number }) => {
    try {
      await dispatch(updateStream({ id: data.id, name: data.name }))
    } catch (error) {
      console.log(error)
    }
  }

  const onClickAddGroupToStream = async (group: GroupsShortType | null) => {
    if (!selectedStreamIdToAddGroup || !group) return
    try {
      await dispatch(
        addGroupToStream({
          groupId: group.id,
          streamId: selectedStreamIdToAddGroup,
        }),
      )
      setSelectedGroup(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!selectedSemester.length) return
    const semestersString = selectedSemester.map((el: (typeof semesters)[number]) => el.id).join(",")
    dispatch(setStreamFilters(semestersString))
  }, [selectedSemester])

  useEffect(() => {
    dispatch(getStreams())
  }, [])

  return (
    <>
      <CategoryActionsModal
        isOnlyName
        modalData={modalData}
        nameLabel="Назва потоку*"
        setModalData={setModalData}
        updatingCategory={updatingStream}
        onCreateCategory={onCreateStream}
        onUpdateCategory={onUpdateStream}
        setUpdatingCategory={setUpdatingStream}
        title={modalData.actionType === "create" ? "Створити новий потік" : "Оновити потік*"}
      />

      <SelectGroupModal
        hideTrigger
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        defaultOpen={isSelectGroupModalOpen}
        onClickSelect={onClickAddGroupToStream}
        setDefaultOpen={setIsSelectGroupModalOpen}
      />

      <CombineStreamLessonsModal
        isOpen={isCombineModalOpen}
        selectedStream={selectedStream}
        setIsOpen={setIsCombineModalOpen}
        selectedLessons={selectedLessons}
      />

      <StreamLessonDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        selectedLessonFromDetails={selectedLessonFromDetails}
        setSelectedLessonFromDetails={setSelectedLessonFromDetails}
      />

      <ManageStreamGroups
        manageOpen={manageStreamGroupsOpen}
        setManageOpen={setManageStreamGroupsOpen}
        activeStream={selectedStream}
        // availableGroups={availableGroups}
        // onRemoveGroup={onRemoveGroup}
        // onAddGroup={onAddGroup}
        // onDeleteStream={onDeleteStream}
      />

      <RootContainer classNames="flex gap-10 !min-h-[calc(100vh-160px)] !px-0">
        <div className="flex flex-col flex-1">
          <div className="">
            <div className="flex w-full justify-between items-center py-2.5 px-4 border-b">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Потік</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-card-foreground leading-tight">
                      {selectedStream?.name ?? "Оберіть потік"}
                    </h1>
                    {selectedStream && (
                      <Badge
                        variant={true ? "default" : "secondary"}
                        // variant={selectedStream.status === "active" ? "default" : "secondary"}
                        className="text-[10px] text-primary-foreground"
                      >
                        {true ? "Активний" : "Неактивний"}
                        {/* {selectedStream.status === "active" ? "Активний" : "Неактивний"} */}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <InputSearch
                  value={globalFilter}
                  placeholder="Знайти..."
                  className="h-9 bg-input/30 shadow-xs"
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />

                <PopoverFilter
                  enableSelectAll
                  className="!h-9"
                  label="Семестри"
                  items={semesters}
                  itemsPrefix="Семестр"
                  filterVariant="default"
                  selectAllLabel="Вибрати всі"
                  selectedItems={selectedSemester}
                  setSelectedItems={setSelectedSemester}
                />

                {selectedLessons.length > 1 && <Button onClick={() => setIsCombineModalOpen(true)}>Об'єднати</Button>}

                {/* <StreamsListDrawer
                setModalData={setModalData}
                isDrawerOpen={isDrawerOpen}
                selectedGroup={selectedGroup}
                selectedStream={selectedStream}
                setIsDrawerOpen={setIsDrawerOpen}
                setSelectedStream={setSelectedStream}
                preSelectedStream={preSelectedStream}
                setUpdatingStream={setUpdatingStream}
                setPreSelectedStream={setPreSelectedStream}
                setIsSelectGroupModalOpen={setIsSelectGroupModalOpen}
                setSelectedStreamIdToAddGroup={setSelectedStreamIdToAddGroup}
              /> */}
              </div>
            </div>

            <div className="flex w-full justify-between items-center py-2.5 px-4 mb-4 border-b">
              <div className="flex gap-2 items-center">
                <StreamSelector
                  popoverOpen={selectStreamPopoverOpen}
                  setPopoverOpen={setSelectStreamPopoverOpen}
                  activeStream={selectedStream}
                  // onSelectStream={handleSelectStream}
                  // setCreateOpen={setCreateOpen}
                />

                {/* {selectedStream && ( */}
                {true && (
                  <Button
                    variant="ghost"
                    onClick={() => setManageStreamGroupsOpen(true)}
                    className="!h-9 text-muted-foreground hover:text-foreground"
                  >
                    <Users className="size-4 mr-1.5" />
                    Групи
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 1, name: "PH9-25-1" },
                  { id: 2, name: "PH9-25-2" },
                ].length > 0 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    {[
                      { id: 1, name: "PH9-25-1" },
                      { id: 2, name: "PH9-25-2" },
                    ].map((g) => (
                      <Badge key={g.id} variant="outline" className="text-xs text-foreground">
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* {selectedStream && selectedStream.groups.length > 0 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    {selectedStream.groups.map((g) => (
                      <Badge key={g.id} variant="outline" className="text-xs text-foreground">
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {true ? (
            <StreamsLessonsTable
              globalFilter={globalFilter}
              selectedStream={selectedStream}
              setGlobalFilter={setGlobalFilter}
              selectedLessons={selectedLessons}
              selectedSemester={selectedSemester}
              setSelectedLessons={setSelectedLessons}
              setIsDetailsModalOpen={setIsDetailsModalOpen}
              setSelectedLessonFromDetails={setSelectedLessonFromDetails}
            />
          ) : (
            <div className="text-center font-mono py-20">Виберіть потік для об'єднання дисциплін.</div>
          )}
        </div>
      </RootContainer>
    </>
  )
}

export default StreamsPage
