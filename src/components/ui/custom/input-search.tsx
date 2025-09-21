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
        "flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background",
        "group-has-focus !shadow-none",
        className,
      )}
    >
      {Icon ? <Icon className="h-[16px] w-[16px]" /> : <Search className="h-[16px] w-[16px]" />}
      <input
        {...props}
        type="search"
        ref={ref}
        className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
})

InputSearch.displayName = "InputSearch"

export { InputSearch }
