import { useSelector } from "react-redux"
import { useState, type Dispatch, type FC, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/common/dialog"
import { Button } from "@/components/ui/common/button"
import SpecializationPopover from "./specialization-popover"
import { Separator } from "@/components/ui/common/separator"
import { SpecializationTable } from "./specialization-table"
import { groupsSelector } from "@/store/groups/groups-slice"
import { InputSearch } from "@/components/ui/custom/input-search"

interface ISpecializationModalProps {
  isOpen: boolean
  groupId: string
  setOpenedModalName: Dispatch<SetStateAction<string>>
}

const MODAL_NAME = "specialities"

const SpecializationModal: FC<ISpecializationModalProps> = ({ isOpen, groupId, setOpenedModalName }) => {
  const { group } = useSelector(groupsSelector)

  const [globalSearch, setGlobalSearch] = useState("")

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === MODAL_NAME ? "" : MODAL_NAME))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[1100px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="pb-4">Спеціалізовані підгрупи:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Ви можете встановити спеціалізовані підгрупи за вибірковими дисциплінами
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription className="px-4 min-h-[50vh] max-h-[60vh] overflow-auto">
          <div className="flex gap-2 my-4">
            <InputSearch
              className="w-full"
              value={globalSearch}
              placeholder="Знайти дисципліну..."
              onChange={(e) => setGlobalSearch(e.target.value)}
            />

            <Button variant="outline" disabled>
              Вибрати семестр
            </Button>
          </div>

          {group ? (
            <SpecializationTable
              globalSearch={globalSearch}
              groupLoad={group.groupLoad || []}
              setGlobalSearch={setGlobalSearch}
              specializationList={group.specializationList}
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-[50%]">
              <h4 className="font-bold text-lg">Відсутнє навантаження групи!</h4>
              <p className="text-md">Навчальний план, що використовує група не містить дисциплін</p>
            </div>
          )}
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center mt-6 px-4">
          <Button onClick={() => setOpenedModalName("")}>Закрити</Button>

          <SpecializationPopover groupId={+groupId} specializationList={group?.specializationList} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SpecializationModal
