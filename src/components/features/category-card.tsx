import { type LucideProps } from "lucide-react"

import { Badge } from "@/components/ui/common/badge"
import { ActionsDropdown } from "./actions-dropdown"
import { Card, CardFooter, CardHeader, CardAction, CardDescription } from "@/components/ui/common/card"

interface ICategoryCardProps {
  itemId: number
  label: string
  name: string
  count: number
  itemsLabel: string
  onClickUpdateFunction?: (id: number) => void
  onClickDeleteFunction?: (id: number) => void
  ItemsIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const CategoryCard: React.FC<ICategoryCardProps> = ({
  name,
  count,
  itemId,
  ItemsIcon,
  onClickDeleteFunction,
  onClickUpdateFunction,
  label = "",
  itemsLabel = "",
}) => {
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-0 rounded-xl border py-3 shadow-sm group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
      {/* <Card className="shadow-none hover:border-primary gap-0 min-h-[100px] py-3"> */}
      <CardHeader className="px-3 flex justify-between items-center">
        <CardDescription className="whitespace-nowrap">{label}</CardDescription>

        <CardAction>
          <ActionsDropdown
            itemId={itemId}
            onClickUpdateFunction={onClickUpdateFunction}
            onClickDeleteFunction={onClickDeleteFunction}
          />
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm px-3 mb-auto">
        <div className="line-clamp-1 flex gap-2 font-medium">{name}</div>
      </CardFooter>

      <Badge variant="outline" className="mx-3 mt-3">
        {ItemsIcon && <ItemsIcon />}
        {count} {itemsLabel}
      </Badge>
    </Card>
  )
}

export { CategoryCard }
