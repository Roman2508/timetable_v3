import { Plus } from 'lucide-react'
import { CategoryCard } from '~/components/features/category-card/category-card'
import { RootContainer } from '~/components/layouts/root-container'
import { Card } from '~/components/ui/common/card'

const plans = [
  { id: 1, name: 'Фармація, промислова фармація (денна форма)', count: 12, checked: true },
  { id: 2, name: 'Технології медичної діагностики та лікування', count: 17, checked: false },
  { id: 3, name: 'Фармація, промислова фармація (заочна форма)', count: 7, checked: true },
]

export default function PlansPage() {
  return (
    <RootContainer>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl">Навчальні плани</h2>

        <div className="flex items-center gap-2"></div>
      </div>

      <div className="grid grid-cols-5 gap-4 flex-wrap mb-10">
        {plans.map((item) => (
          <CategoryCard key={item.id} name={item.name} count={item.count} />
        ))}

        <Card className="shadow-none hover:border-primary min-h-[100px] flex items-center justify-center cursor-pointer border-dashed hover:text-primary">
          <p className="flex items-center gap-1">
            <Plus className="w-4" />
            <span className="text-sm">Створити новий</span>
          </p>
        </Card>
      </div>

      {/* <h2 className="text-xl mb-4">Склад комісії</h2> */}
      {/* 
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Всі</TabsTrigger>
          <TabsTrigger value="active">Активні</TabsTrigger>
          <TabsTrigger value="archive">Архів</TabsTrigger>
        </TabsList>
      </Tabs> */}

      {/* <TeachersList /> */}
    </RootContainer>
  )
}
