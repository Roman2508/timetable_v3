import { ListFilter, UnfoldVertical, NotebookPen, BarChart3, Printer } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/common/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/popover"

export type StatItem = {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

interface Props {
  gradeBook: boolean
  stats: StatItem[]
  onFilter: () => void
  onSummary: () => void
}

export const ActionButtons = ({ gradeBook, stats, onFilter, onSummary }: Props) => {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onFilter}
          >
            <ListFilter className="size-4" />
            <span className="sr-only">Знайти журнал</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Знайти електронний журнал</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onSummary}
          >
            <UnfoldVertical className="rotate-[90deg] size-4" />
            <span className="sr-only">Підсумки</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Додати підсумок</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
            <NotebookPen className="size-4" />
            <span className="sr-only">Теми</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Теми</TooltipContent>
      </Tooltip>

      {/* Statistics popover */}
      <Popover>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 text-muted-foreground hover:text-foreground",
                  !gradeBook && "opacity-40 pointer-events-none",
                )}
              >
                <BarChart3 className="size-4" />
                <span className="sr-only">Статистика</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Статистика</TooltipContent>
        </Tooltip>

        <PopoverContent align="end" className="w-72 p-3">
          <p className="text-xs font-semibold text-foreground mb-2.5">Статистика журналу</p>
          <p className="text-[10px] text-muted-foreground mb-2">
            {"АПУ/ЯПУ розраховані за 12-бальною системою (буде пов'язано з системою оцінювання)"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
                <div className={`flex items-center justify-center size-8 rounded-md ${stat.color}`}>
                  <stat.icon className="size-4" />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-foreground leading-none">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
            <Printer className="size-4" />
            <span className="sr-only">Друк</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Друк</TooltipContent>
      </Tooltip>
    </div>
  )
}
