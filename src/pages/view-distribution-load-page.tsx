import { type FC } from "react"

import { RootContainer } from "@/components/layouts/root-container"
import { Button } from "@/components/ui/common/button"
import { PageTopTitle } from "@/components/features/page-top-title"
import { Card } from "@/components/ui/common/card"

const ViewDistributionLoadPage: FC = () => {
  return (
    <RootContainer classNames="relative">
      <div className="flex justify-between items-center mb-4">
        <PageTopTitle
          title="Перегляд навантаження"
          description="Перегляд навантаження, по циклових комісіях та групах, за півріччя"
        />

        <div className="flex gap-2">
          <Button>Півріччя</Button>
          <Button>Група</Button>
          <Button>Циклова</Button>
        </div>
      </div>

      <Card>
        <h1 className="text-center font-semibold text-lg mb-4">Table</h1>
      </Card>
    </RootContainer>
  )
}

export default ViewDistributionLoadPage
