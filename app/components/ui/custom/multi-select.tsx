import { useEffect, useState, type FC } from "react"

import { MultiSelect as ShadcnMultiSelect } from "~/components/ui/common/multi-select"

type Option = {
  label: string
  value: string
}

type ItemType = {
  id: number | string
  name: string
  [key: string]: any
}

interface Props {
  items: ItemType[]
  disabled?: boolean
  itemPrefix?: string
  activeItems?: string[]
  onChangeSelected: (value: string[]) => void
}

const MultiSelect: FC<Props> = ({ items, disabled, activeItems, onChangeSelected }) => {
  const [activeOptions, setActiveOptions] = useState<string[]>([])
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    if (items.length) {
      const newOptions = items.map((el) => ({ label: el.name, value: String(el.id) }))
      setOptions(newOptions)
    }

    if (activeItems && activeItems.length) {
      setActiveOptions(activeItems)
    }
  }, [items, activeItems])

  return (
    <div>
      <ShadcnMultiSelect
        maxCount={3}
        animation={2}
        options={options}
        variant="inverted"
        defaultValue={activeOptions}
        onValueChange={(val) => {
          setActiveOptions(val)
          onChangeSelected(val)
        }}
      />
    </div>
  )
}

export { MultiSelect }
