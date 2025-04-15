import React from 'react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/common/dropdown-menu'
import { Button } from '~/components/ui/common/button'
// import { IconChevronDown } from "@tabler/icons-react";
import { ChevronDown } from 'lucide-react'
import { Ellipsis, ListFilter, PenLine, Replace, Reply, Trash } from 'lucide-react'

const cmk = [
  { id: 1, name: 'Загальноосвітніх дисциплін', count: 12, checked: true },
  { id: 2, name: 'Фармацевтичних дисциплін', count: 17, checked: false },
  { id: 3, name: 'Гуманітарних дисциплін', count: 7, checked: true },
  { id: 4, name: 'Медико-біологічних дисциплін', count: 5, checked: true },
  { id: 5, name: 'Хімічних дисциплін', count: 10, checked: false },
]

const TeacherActionsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Ellipsis className="w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <PenLine />
          Оновити
        </DropdownMenuItem>

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Reply className="w-4 mr-2 opacity-70" />
              {/* <Replace className="w-4 mr-2" /> */}
              Змінти ЦК
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {cmk.map((item) => {
                  return (
                    <DropdownMenuItem key={item.id}>
                      ЦК {item.name} ({item.count})
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Trash />
          Видалити
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { TeacherActionsDropdown }
