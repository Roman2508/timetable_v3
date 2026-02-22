import { useSelector } from "react-redux"
import { Layers, ChevronDown, Check, Plus, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { Badge } from "@/components/ui/common/badge"
import { Button } from "@/components/ui/common/button"
import { streamsSelector } from "@/store/streams/streams-slice"
import { ScrollArea } from "@/components/ui/common/scroll-area"
import type { StreamsType } from "@/store/streams/streams-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"

interface Props {
  popoverOpen: boolean
  setPopoverOpen: (open: boolean) => void
  activeStream: StreamsType | null
  //   onSelectStream: (streamId: number) => void
  //   setCreateOpen: (open: boolean) => void
}

const StreamSelector = ({ popoverOpen, setPopoverOpen, activeStream /* onSelectStream, setCreateOpen */ }: Props) => {
  const dispatch = useAppDispatch()

  const { streams } = useSelector(streamsSelector)

  //   const onPreSelectStream = (stream: StreamsType) => {
  //     setPreSelectedStream((prev) => {
  //       if (!prev) return stream
  //       if (prev.id !== stream.id) return stream
  //       return null
  //     })
  //   }

  //   const onSelectStream = () => {
  //     if (!preSelectedStream) return
  //     setSelectedStream(preSelectedStream)
  //     setIsDrawerOpen(false)
  //   }

  //   const onClickUpdateFunction = (id: number) => {
  //     if (!streams) return
  //     const selectedStream = streams.find((el) => el.id === id)
  //     if (selectedStream) {
  //       setUpdatingStream(selectedStream)
  //       setModalData({ isOpen: true, actionType: "update" })
  //     }
  //   }

  //   const onClickDeleteFunction = async (id: number) => {
  //     if (!streams) return
  //     const selectedStream = streams.find((el) => el.id === id)
  //     if (!selectedStream) return

  //     if (selectedStream.groups.length) {
  //       AlertWindow(dialogText.alert.stream_delete.title, dialogText.alert.stream_delete.text)
  //       return
  //     }

  //     const confirmed = await ConfirmWindow(dialogText.confirm.streams.title, dialogText.confirm.streams.text)
  //     if (confirmed) {
  //       dispatch(deleteStream(id))
  //     }
  //   }

  //   const handleChangeOpen = () => {
  //     if (isDrawerOpen) setPreSelectedStream(null)
  //     else setPreSelectedStream(selectedStream)
  //   }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={popoverOpen}
          className="w-64 justify-between bg-card text-card-foreground border-border hover:bg-accent shadow-xs"
        >
          <span className="flex items-center gap-2 truncate">
            <Layers className="size-4 text-primary shrink-0" />
            {activeStream ? activeStream.name : "Оберіть потік..."}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">Навчальні потоки</p>
        </div>
        <ScrollArea className="max-h-60">
          <div className="p-1">
            {streams ? (
              streams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => {
                    // onSelectStream(stream.id)
                    setPopoverOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors",
                    activeStream?.id === stream.id ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Check className={cn("size-4", activeStream?.id === stream.id ? "opacity-100" : "opacity-0")} />
                    <span className="font-medium">{stream.name}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Badge
                      variant={true ? "default" : "secondary"}
                      // variant={stream.status === "active" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {stream.groups.length}
                      <Users className="size-3 ml-0.5" />
                    </Badge>
                  </span>
                </button>
              ))
            ) : (
              <p>Потоків немає</p>
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-border p-1">
          <button
            onClick={() => {
              setPopoverOpen(false)
              //   setCreateOpen(true)
            }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-primary hover:bg-accent transition-colors"
          >
            <Plus className="size-4" />
            Створити новий потік
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default StreamSelector
