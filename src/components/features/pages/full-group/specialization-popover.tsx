import { useParams } from "react-router"
import { useState, type FC } from "react"
import { Pencil, Trash, Check, X } from "lucide-react"

import { useAppDispatch } from "@/store/store"
import { Input } from "@/components/ui/common/input"
import { Button } from "@/components/ui/common/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"
import { createSpecialization, deleteSpecialization, updateSpecialization } from "@/store/groups/groups-async-actions"

interface Props {
  specializationList: string[]
}

const SpecializationPopover: FC<Props> = ({ specializationList }) => {
  const dispatch = useAppDispatch()

  const { id: groupId } = useParams()

  const [specName, setSpecName] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [oldSpecName, setOldSpecName] = useState("")
  const [specActionType, setSpecActionType] = useState<"create" | "update">("create")

  const onClickEdit = (name: string) => {
    setSpecActionType("update")
    setOldSpecName(name)
    setSpecName(name)
  }

  const onClickCancelEdit = () => {
    setSpecActionType("create")
    setOldSpecName("")
    setSpecName("")
  }

  const onChangeSpecName = async () => {
    try {
      setIsPending(true)
      if (specActionType === "create") {
        await dispatch(createSpecialization({ name: specName, groupId: Number(groupId) }))
      } else {
        await dispatch(updateSpecialization({ newName: specName, oldName: oldSpecName, groupId: Number(groupId) }))
      }
      setOldSpecName("")
      setSpecName("")
    } finally {
      setIsPending(false)
    }
  }

  const onDeleteSpecGroup = async (name: string) => {
    try {
      if (window.confirm("Ви дійсно хочете видалити спец. підгрупу")) {
        setIsPending(true)
        await dispatch(deleteSpecialization({ groupId: Number(groupId), name }))
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Редагувати спеціалізовані підгрупи</Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Спеціалізовані підгрупи</h4>
          </div>

          <div className="max-h-100 overflow-auto pb-2">
            <div className="border-b-2 flex p-1 font-mono">
              <div className="w-6">№</div>
              <div className="flex-1">НАЗВА</div>
              <div className="">ДІЇ</div>
            </div>
            {specializationList.length ? (
              specializationList.map((el, index) => (
                <div className="border-b flex items-center text-sm" key={el}>
                  <div className="w-6">{index + 1}</div>
                  <div className="flex-1">{el}</div>
                  <div className="">
                    <Button variant="ghost" className="h-8 w-8" disabled={isPending} onClick={() => onClickEdit(el)}>
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={isPending}
                      onClick={() => {
                        onDeleteSpecGroup(el)
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="my-6 flex flex-col text-center">
                <h5 className="font-semibold">Cпец.підгрупи відсутні</h5>
                <p className="text-sm">Ще не додано жодної спец.підгрупи</p>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="h-8 w-8" onClick={onChangeSpecName} disabled={!specName || isPending}>
                <Check />
              </Button>

              <Button
                variant="ghost"
                className="h-8 w-8"
                onClick={onClickCancelEdit}
                disabled={specActionType === "create" || isPending}
              >
                <X />
              </Button>

              <Input
                value={specName}
                disabled={isPending}
                className="col-span-2 h-8"
                placeholder="Назва підгрупи"
                onChange={(e) => setSpecName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SpecializationPopover
