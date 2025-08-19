import { useSelector } from "react-redux"
import { ChevronsUpDown, Search } from "lucide-react"
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog"
import { Button } from "~/components/ui/common/button"
import { SelectGroupTable } from "./select-group-table"
import { Separator } from "~/components/ui/common/separator"
import { groupsSelector } from "~/store/groups/groups-slice"
import { InputSearch } from "~/components/ui/custom/input-search"
import type { GroupsShortType } from "~/store/groups/groups-types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible"

interface ISelectGroupModal {
  hideTrigger?: boolean
  defaultOpen?: boolean
  selectedGroup: GroupsShortType | null
  setDefaultOpen?: Dispatch<SetStateAction<boolean>>
  onClickSelect?: (group: GroupsShortType | null) => void
  setSelectedGroup: Dispatch<SetStateAction<GroupsShortType | null>>
}

const SelectGroupModal: FC<ISelectGroupModal> = ({
  onClickSelect,
  selectedGroup,
  setDefaultOpen,
  setSelectedGroup,
  hideTrigger = false,
  defaultOpen = false,
}) => {
  const { groupCategories } = useSelector(groupsSelector)

  const [isModalOpen, setIsModalOpen] = useState(defaultOpen)
  const [preSelectedGroup, setPreSelectedGroup] = useState<GroupsShortType | null>(selectedGroup)

  const onSelectedGroup = () => {
    setSelectedGroup(preSelectedGroup)
    setIsModalOpen(false)
    setDefaultOpen && setDefaultOpen(false)
    onClickSelect && onClickSelect(preSelectedGroup)
  }

  useEffect(() => {
    setIsModalOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open)
        setDefaultOpen && setDefaultOpen(open)
      }}
    >
      {!hideTrigger && (
        <DialogTrigger>
          <Button onClick={() => setIsModalOpen(true)}>
            <Search />
            Вибрати групу
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть групу:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">Виберіть групу, яка буде використовуватись для подальших дій</p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <InputSearch className="mb-4 mx-4 mr-6" placeholder="Знайти групу..." />

          <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
            {(groupCategories ?? []).map((category) => (
              <Collapsible key={category.id} className="pt-2 border mb-4" defaultOpen>
                <div className="flex items-center justify-between pl-4 pb-2 pr-2">
                  <h4 className="text-sm font-semibold">{category.name}</h4>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2">
                  <SelectGroupTable
                    groups={category.groups}
                    selectedGroup={preSelectedGroup}
                    setSelectedGroup={setPreSelectedGroup}
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button onClick={() => onSelectedGroup()}>Вибрати</Button>

          {preSelectedGroup && (
            <div className="font-mono mr-3">
              Вибрано групу:
              <span className="font-bold"> {preSelectedGroup.name}</span>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectGroupModal
