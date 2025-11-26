import { cn } from "@/lib/utils"
import React from "react"

const WideContainer: React.FC<React.PropsWithChildren<{ classNames?: string }>> = ({ children, classNames = "" }) => {
  return <div className={cn(`w-full max-w-[1920px] mx-auto px-[20px] ${classNames}`)}>{children}</div>
}

export { WideContainer }
