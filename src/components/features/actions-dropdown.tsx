import React, { type ForwardRefExoticComponent, type RefAttributes } from "react"
import { ArrowUpDown, Ellipsis, PenLine, Reply, Trash, type LucideProps } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/common/dropdown-menu"
import { Button } from "@/components/ui/common/button"

type AdditionalDropdownItemsType = {
  label: string
  onClick: (id: number) => void
  icon?: React.ReactNode
  disabled?: boolean
}

type CategoriesType = {
  id: number
  name: string
  count: number
  [key: string]: any
}

interface IActionsDropdownProps {
  itemId: number
  categoryPrefix?: string
  updateDisabled?: boolean
  deleteDisabled?: boolean
  categoriesList?: CategoriesType[]
  onClickUpdateFunction?: (id: number) => void
  onClickDeleteFunction?: (id: number) => void
  changeStatusFunction?: (id: number) => void
  additionalItems?: AdditionalDropdownItemsType[]
  changeCategoryFunction?: (id: number, categoryId: number) => void
}

const ActionsDropdown: React.FC<IActionsDropdownProps> = ({
  itemId,
  categoryPrefix,
  categoriesList,
  additionalItems,
  deleteDisabled,
  updateDisabled,
  changeStatusFunction,
  onClickUpdateFunction,
  onClickDeleteFunction,
  changeCategoryFunction,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
          <Ellipsis className="w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {onClickUpdateFunction && (
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={updateDisabled}
            onClick={(e) => {
              e.stopPropagation()
              onClickUpdateFunction(itemId)
            }}
          >
            <PenLine />
            Оновити
          </DropdownMenuItem>
        )}

        {additionalItems?.length &&
          additionalItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              disabled={item.disabled}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                item.onClick(itemId)
              }}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}

        {changeCategoryFunction && !!categoriesList?.length && (
          <DropdownMenuGroup className="cursor-pointer">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Reply className="w-4 mr-2 opacity-70" />
                Змінти підрозділ
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {categoriesList.map((item) => {
                    return (
                      <DropdownMenuItem key={item.id} onClick={() => changeCategoryFunction(itemId, item.id)}>
                        {categoryPrefix} {item.name} ({item.count})
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        )}

        {changeStatusFunction && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              changeStatusFunction(itemId)
            }}
          >
            <ArrowUpDown />
            Змінити статус
          </DropdownMenuItem>
        )}

        {onClickDeleteFunction && (
          <DropdownMenuItem
            disabled={deleteDisabled}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onClickDeleteFunction(itemId)
            }}
          >
            <Trash />
            Видалити
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ActionsDropdown }
