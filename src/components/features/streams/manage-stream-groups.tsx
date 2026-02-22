import { X, Trash2, Plus } from "lucide-react"

import { Badge } from "@/components/ui/common/badge"
import { Button } from "@/components/ui/common/button"
import type { StreamsType } from "@/store/streams/streams-types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/common/dialog"

interface Props {
  manageOpen: boolean
  setManageOpen: (open: boolean) => void
  activeStream: StreamsType | null
  //   availableGroups: string[]
  //   onRemoveGroup: (streamId: number, groupName: string) => void
  //   onAddGroup: (streamId: number, groupName: string) => void
  //   onDeleteStream: (streamId: number) => void
}

const ManageStreamGroups = ({
  manageOpen,
  setManageOpen,
  activeStream,
  //   availableGroups,
  //   onRemoveGroup,
  //   onAddGroup,
  //   onDeleteStream,
}: Props) => {
  return (
    <Dialog open={manageOpen} onOpenChange={setManageOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Групи потоку &laquo;{activeStream?.name}&raquo;</DialogTitle>
          <DialogDescription>Додавайте або видаляйте групи з потоку</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Поточні групи</p>
            {activeStream?.groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">Групи ще не додані</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeStream?.groups.map((g) => (
                  <Badge
                    key={g.id}
                    variant="secondary"
                    className="flex items-center gap-1 pl-2.5 pr-1 py-1 text-secondary-foreground"
                  >
                    {g.name}
                    <button
                      //   onClick={() => onRemoveGroup(activeStream.id, g.name)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                      aria-label={`Видалити ${g.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Доступні групи</p>
            <div className="grid grid-cols-2 gap-2">
              {/* {availableGroups
                .filter((g) => !activeStream.groups.includes(g))
                .map((g) => (
                  <Button
                    key={g}
                    variant="outline"
                    size="sm"
                    onClick={() => onAddGroup(activeStream.id, g)}
                    className="justify-start gap-2"
                  >
                    <Plus className="size-3.5" />
                    {g}
                  </Button>
                ))}
              {availableGroups.filter((g) => !activeStream.groups.includes(g)).length === 0 && (
                <p className="col-span-2 text-sm text-muted-foreground">Усі групи вже додані</p>
              )} */}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                // onDeleteStream(activeStream.id)
                setManageOpen(false)
              }}
              className="text-destructive-foreground"
            >
              <Trash2 className="size-4 mr-1.5" />
              Видалити потік
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ManageStreamGroups
