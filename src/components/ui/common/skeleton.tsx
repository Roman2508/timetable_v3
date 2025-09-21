import { cn } from "@/lib/utils"

function Skeleton({
  className,
  disableAnimation = true,
  ...props
}: React.ComponentProps<"div"> & { disableAnimation?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent rounded-md", disableAnimation ? "" : "animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
