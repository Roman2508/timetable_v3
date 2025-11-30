import { Search } from "lucide-react"
import React from "react"

import { cn } from "@/lib/utils"

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>

type InputProps = SearchProps & {
  Icon?: React.ElementType
}

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(({ className, Icon, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-9 items-center rounded-md border bg-white pl-3 text-sm transition-all",
        "border-input", // обычная граница
        "has-[:focus-visible]:border-primary", // синяя граница при фокусе внутри
        "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20", // лёгкий glow (по желанию)
        "has-[:focus-visible]:shadow-[0_0_0_3px_rgba(59,130,246,0.3)]", // альтернатива: внешняя тень-обводка
        className,
      )}
    >
      {Icon ? <Icon className="h-[16px] w-[16px]" /> : <Search className="h-[16px] w-[16px]" />}
      <input
        {...props}
        type="search"
        ref={ref}
        className={cn(
          "w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none ",
          "disabled:cursor-not-allowed disabled:opacity-50 ",
        )}
      />
    </div>
  )
})

InputSearch.displayName = "InputSearch"

export { InputSearch }
