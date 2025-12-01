import { useMemo, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, X } from "lucide-react"

import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/common/command"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/common/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"

interface Props {
  items: { id: number; name: string }[]
  selectedItem?: number
  onChange: (value: number | null) => void
  label?: string
  isLabelInside?: boolean
  classNames?: string
}

export function Autocomplete({ items, selectedItem, onChange, label, isLabelInside, classNames = "" }: Props) {
  const [open, setOpen] = useState(false)

  const list = useMemo(() => items.map((item) => ({ key: item.id, value: item.name })), [items])

  const labelText = selectedItem ? list.find((el) => el.key === selectedItem)?.value : "Виберіть..."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className={cn("w-[200px] justify-between relative", classNames)}
        >
          {!isLabelInside && (
            <span className="absolute top-[-8px] font-sm" style={{ fontSize: "12px" }}>
              {label}
            </span>
          )}

          {labelText}

          {selectedItem ? (
            <div
              role="button"
              className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 z-50"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
            >
              <X className="h-4 w-4" />
            </div>
          ) : (
            <div role="button" className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 z-50">
              <ChevronsUpDownIcon className="h-4 w-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Пошук..." />

          <CommandList>
            <CommandEmpty>Нічого не знайдено.</CommandEmpty>

            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item.key}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.key)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn("mr-2 h-4 w-4", selectedItem === item.key ? "opacity-100" : "opacity-0", "truncate")}
                  />
                  <p className="truncate">{item.value}</p>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
