import { Search } from "lucide-react";
import React from "react";

import { cn } from "~/lib/utils";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

type InputProps = SearchProps & {
  Icon?: React.ElementType;
};

const InputSearch = React.forwardRef<HTMLInputElement, InputProps>(({ className, Icon, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background",
        "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {Icon ? <Icon className="h-[16px] w-[16px]" /> : <Search className="h-[16px] w-[16px]" />}
      <input
        {...props}
        type="search"
        ref={ref}
        className="w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"

        // className={cn(
        //   "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        //   "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        //   "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        //   className,
        // )}
      />
    </div>
  );
});

InputSearch.displayName = "InputSearch";

export { InputSearch };
