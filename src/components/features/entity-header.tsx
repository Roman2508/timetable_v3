import React from "react"
import type { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "../ui/common/badge"

interface IEntityHeaderProps {
  name: string
  label: string
  status: string
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const EntityHeader: React.FC<IEntityHeaderProps> = ({ label, name, status, Icon }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 text-black/40" />
        <div className="text-black/40 text-sm">{label}</div>
      </div>

      <div className="flex gap-3 items-center">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <Badge
          variant="outline"
          className={cn(
            status === "Активний" ? "text-success bg-success-background border-0" : "",
            status === "Архів" ? "text-error bg-error-background border-0" : "",
            status === "Навчається" ? "text-success bg-success-background border-0" : "",
            status === "Академічна відпустка" ? "text-primary bg-primary-light border-0" : "",
            status === "Відраховано" ? "text-error bg-error-background border-0" : "",
          )}
        >
          {status}
        </Badge>
      </div>
    </div>
  )
}

export default EntityHeader
