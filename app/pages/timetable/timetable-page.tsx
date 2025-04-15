import { TeachersList } from '~/components/features/teachers/teachers-list'
// import { WideContainer } from '@/components/layouts/wide-container'
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/common/tabs'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/common/dropdown-menu'
import { Button } from '~/components/ui/common/button'
// import { ListFilter } from 'lucide-react'
// import { IconChevronDown } from '@tabler/icons-react'

import { WideContainer } from '~/components/layouts/wide-container'
import { ChevronDown } from 'lucide-react'

const TimetablePage = () => {
  return (
    <WideContainer>
      <div className="w-full h-full">
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => {
              const label = i === 0 ? 'Циклова комісія' : i === 1 ? 'Група' : i === 2 ? 'Тиждень' : 'Семестр'
              const width = i === 0 ? 'min-w-80' : i === 1 ? 'min-w-40' : 'min-w-20'

              return (
                <DropdownMenu key={i}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`${width} flex justify-between shadow-0`}
                      //   className="bg-primary hover:bg-primary/90 text-primary-light hover:text-primary-light"
                    >
                      {/* <ListFilter /> */}
                      <span className="hidden lg:inline">{label}</span>
                      <span className="lg:hidden">{label}</span>
                      {/* <IconChevronDown /> */}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-75">
                    {[
                      { id: 1, checked: true, name: 'Фармація' },
                      { id: 2, checked: true, name: 'Лаб. діагностика' },
                    ].map((item) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={item.id}
                          className="capitalize"
                          checked={item.checked}
                          onCheckedChange={(value: any) => {
                            //   column.toggleVisibility(!!value)
                          }}
                        >
                          ЦК {item.name}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Групи</TabsTrigger>
              <TabsTrigger value="active">Викладачі</TabsTrigger>
              <TabsTrigger value="archive">Аудиторії</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-90 border">
            <TeachersList />
          </div>

          <div className="flex-1 border-t">
            <div className="flex border-x">
              <div className="flex justify-between w-full">
                <div className="flex gap-2 p-2">
                  <Button variant="outline" size="sm">
                    Наступний тиждень
                  </Button>
                  <Button variant="outline" size="sm">
                    Попередній тиждень
                  </Button>
                </div>

                <div className="p-2">
                  <Button variant="outline" size="sm">
                    Копіювати розклад
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-6 border-l">
                <div className="h-8 border-t h-[33px]"></div>
                {[...Array(7)].map((_, i) => (
                  <div
                    className={i === 6 ? 'text-xs font-bold h-25 p-2 border-y' : 'text-xs font-bold h-25 p-2 border-t'}
                    key={i}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="w-full border-l grid grid-cols-6">
                {[...Array(6)].map((_, i) => (
                  <div className="border-t" key={i}>
                    <div className="border-b p-2 border-r text-xs font-bold h-[33px]">Пн 02.09</div>

                    {[...Array(7)].map((_, j) => (
                      <div className="h-25 border-b p-2 text-xs border-r overflow-hidden" key={j}>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Ab modi veritatis</p>
                        <p>consectetur adipisicing</p>
                        <p>sit amet</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WideContainer>
  )
}

export default TimetablePage
