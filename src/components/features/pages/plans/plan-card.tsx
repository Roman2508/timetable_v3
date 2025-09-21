import { User } from "lucide-react"
import React from "react"
import { Badge } from "@/components/ui/common/badge"
import { Card, CardFooter, CardHeader } from "@/components/ui/common/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/common/tooltip"
import PlanCardDropdown from "./plan-card-dropdown"
import { Link } from "react-router"

interface IPlanCardProps {
  lessonsCount: number
  groupsCount: number
  name: string
}

const PlanCard: React.FC<IPlanCardProps> = ({ groupsCount, lessonsCount, name }) => {
  return (
    <Card className="shadow-none hover:border-primary gap-0 min-h-[100px] py-3">
      {/* w-[220px] */}
      <CardHeader className="px-3 mb-1 flex justify-between items-center">
        <div>
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Badge variant="outline" className="mr-2">
                <User />
                ОК: {lessonsCount}
              </Badge>
            </TooltipTrigger>

            <TooltipContent>Кількість освітніх компонентів в навчальному плані: 23</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Badge variant="outline" className="">
                <User />
                Групи: {groupsCount}
              </Badge>
            </TooltipTrigger>

            <TooltipContent>
              <p>Групи, що використовують навчальний план:</p>
              <ul>
                <li>- PH9-23-1</li>
                <li>- PH9-23-2</li>
                <li>- PH9-23-3</li>
                <li>- PH9-23-4</li>
              </ul>
              {/* <p>PH9-23-1, PH9-23-2, PH9-23-3, PH9-23-4</p> */}
            </TooltipContent>
          </Tooltip>
        </div>
        {/* <CardDescription className="whitespace-nowrap">Циклова комісія</CardDescription> */}

        <PlanCardDropdown />
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm px-3">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <Link to={`/plans/${1}`} className="hover:underline hover:text-primary">
            {name}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PlanCard
