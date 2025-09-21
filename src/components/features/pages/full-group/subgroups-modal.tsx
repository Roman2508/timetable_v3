import React from "react"
import { useSelector } from "react-redux"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { SubgroupsTable } from "./subgroups-table"
import { Button } from "@/components/ui/common/button"
import { plansSelector } from "@/store/plans/plans-slice"
import SubgroupsCountModal from "./subgroups-count-modal"
import { Separator } from "@/components/ui/common/separator"
import type { GroupLoadType } from "@/store/groups/groups-types"
import { InputSearch } from "@/components/ui/custom/input-search"
import type { SubgroupsLessonsType } from "@/helpers/group-lesson-by-name-subgroups-and-semester"
import { groupsSelector } from "@/store/groups/groups-slice"

interface ISubgroupsModalProps {
  isOpen: boolean
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>
}

const MODAL_NAME = "subgroups"

const SubgroupsModal: React.FC<ISubgroupsModalProps> = ({ isOpen, setOpenedModalName }) => {
  const { group } = useSelector(groupsSelector)

  const [isCountModalOpen, setIsCountModalOpen] = React.useState(false)

  const { plansCategories } = useSelector(plansSelector)

  const [globalSearch, setGlobalSearch] = React.useState("")
  const [selectedLesson, setSelectedLesson] = React.useState<SubgroupsLessonsType | null>(null)

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME))
  }

  return (
    <>
      <SubgroupsCountModal
        selectedLesson={selectedLesson}
        isCountModalOpen={isCountModalOpen}
        groupLoad={group ? group.groupLoad : []}
        setIsCountModalOpen={setIsCountModalOpen}
      />

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="px-0 max-w-[1100px] gap-0">
          <DialogHeader className="px-4 pb-4">
            <DialogTitle className="pb-4">Підгрупи:</DialogTitle>
            <p className="leading-[1.25] opacity-[.6]">
              Ви можете встановити кількість підгруп, на які будуть поділятись дисципліни
            </p>
          </DialogHeader>

          <Separator />

          <DialogDescription className="px-4 min-h-[50vh] max-h-[60vh] overflow-auto">
            {plansCategories?.length ? (
              <>
                <div className="flex gap-2 my-4">
                  <InputSearch
                    className="flex-1"
                    value={globalSearch}
                    placeholder="Знайти дисципліну..."
                    onChange={(e) => setGlobalSearch(e.target.value)}
                  />
                  <Button variant="outline" disabled>
                    Вибрати семестр
                  </Button>
                </div>

                {group?.groupLoad ? (
                  <SubgroupsTable
                    groupLoad={group.groupLoad}
                    globalSearch={globalSearch}
                    selectedLesson={selectedLesson}
                    setGlobalSearch={setGlobalSearch}
                    setSelectedLesson={setSelectedLesson}
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center h-[50%]">
                    <h4 className="font-bold text-lg">Відсутнє навантаження групи!</h4>
                    <p className="text-md">Навчальний план, що використовує група не містить дисциплін</p>
                  </div>
                )}
              </>
            ) : (
              <div className="py-4">
                <h4 className="text-lg font-semibold">Навчальні плани ще не створено.</h4>
                <p className="text-base leading-[1.25] opacity-[.6]">
                  Щоб призначити навантаження групі, спочатку створіть хоча б один навчальний план. Перейдіть до розділу
                  «Навчальні плани» та натисніть «Створити план».
                </p>
              </div>
            )}
          </DialogDescription>

          <Separator />

          <DialogFooter className="flex !justify-between items-center px-4 mt-6">
            <div className="flex justify-between gap-2">
              <Button onClick={() => setOpenedModalName("")}>Закрити</Button>
            </div>

            <div className="flex items-center gap-1">
              <p className="font-mono mr-3 text-right flex flex-col">{selectedLesson ? selectedLesson.name : ""}</p>
              <Button variant="outline" disabled={!selectedLesson} onClick={() => setIsCountModalOpen(true)}>
                Редагувати кількість підгруп
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SubgroupsModal
