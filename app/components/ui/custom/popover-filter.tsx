import { ChevronDown, ListFilter } from "lucide-react"
import { type Dispatch, type FC, type SetStateAction } from "react"

import { Checkbox } from "../common/checkbox"
import { Button, type ButtonSize, type ButtonVariant } from "../common/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover"

type IPopoverItem = {
  id: number
  name: string
} & any

interface IPopoverFilterProps {
  label?: string
  disabled?: boolean
  items: IPopoverItem[]
  itemsPrefix?: string
  selectAllLabel?: string
  filterSize?: ButtonSize
  enableSelectAll?: boolean
  selectedItems: IPopoverItem[]
  filterVariant?: ButtonVariant
  setSelectedItems: Dispatch<SetStateAction<IPopoverItem[]>>
}

export const PopoverFilter: FC<IPopoverFilterProps> = ({
  items,
  selectedItems,
  setSelectedItems,
  label = "Фільтр",
  itemsPrefix = "",
  disabled = false,
  filterSize = "default",
  filterVariant = "outline",
  selectAllLabel = "Всі",
  enableSelectAll = false,
}) => {
  const handleSelected = (id: number) => {
    setSelectedItems((prev) => {
      const isItemSelected = prev.some((el) => el.id === id)
      if (isItemSelected) {
        return prev.filter((el) => el.id !== id).map((el) => ({ id: el.id }))
      }

      const newItem = items.find((el) => el.id === id)
      if (newItem) {
        return [...prev, { id: newItem.id }]
      }

      return prev
    })
  }

  const handleSelectAll = () => {
    setSelectedItems((prev) => {
      if (prev.length) {
        return []
      }
      return items
    })
  }

  const checkIsSelected = (id?: number) => {
    if (id) {
      return selectedItems.some((el) => el.id === id)
    }
    return items.length === selectedItems.length
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={filterVariant} size={filterSize} disabled={disabled}>
          <ListFilter />
          <span className="hidden lg:inline">{label}</span>
          <span className="lg:hidden">{label}</span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {enableSelectAll && (
            <div className="flex items-center space-x-2">
              <Checkbox id="all" checked={checkIsSelected()} onClick={handleSelectAll} />
              <label
                htmlFor="all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {selectAllLabel}
              </label>
            </div>
          )}

          {items.map((item: any) => {
            return (
              <div className="flex items-center space-x-2">
                <Checkbox id={item.id} checked={checkIsSelected(item.id)} onClick={() => handleSelected(item.id)} />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                >
                  {itemsPrefix} {item.name}
                </label>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
