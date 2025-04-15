import { Ellipsis, User } from 'lucide-react'

import { Badge } from '~/components/ui/common/badge'
import { Button } from '~/components/ui/common/button'
import { Card, CardFooter, CardHeader, CardAction, CardDescription } from '~/components/ui/common/card'

interface ICategoryCardProps {
  name: string
  count: number
}

const CategoryCard: React.FC<ICategoryCardProps> = ({ name, count }) => {
  return (
    <Card className="shadow-none hover:border-primary gap-0 min-h-[100px] py-3">
      {/* w-[220px] */}
      <CardHeader className="px-3 flex justify-between items-center">
        <CardDescription className="whitespace-nowrap">Циклова комісія</CardDescription>

        <CardAction>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Ellipsis className="w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm px-3">
        <div className="line-clamp-1 flex gap-2 font-medium">{name}</div>
      </CardFooter>

      <Badge variant="outline" className="mx-3 mt-3">
        <User />
        {count} викл.
      </Badge>
    </Card>
  )
}

export { CategoryCard }

/* 

    <Card className="shadow-none hover:border-primary gap-1 w-[220px] min-h-[100px] cursor-pointer">
      <CardHeader className="px-3">
        <CardDescription className="whitespace-nowrap">
          Циклова комісія
        </CardDescription>

        <CardAction>
          <Badge variant="outline">
            <User />
            {count} викл.
          </Badge>
        </CardAction>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-sm px-3">
        <div className="line-clamp-1 flex gap-2 font-medium">{name}</div>
      </CardFooter>
    </Card>

*/
