import React from "react";
import { Plus } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { TeacherCard } from "~/components/features/pages/teachers/teacher-card";
import { TeachersList } from "~/components/features/pages/teachers/teachers-list";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12, checked: true },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17, checked: false },
  { id: 3, name: "Гуманітарних дисциплін", count: 7, checked: true },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5, checked: true },
  { id: 5, name: "Хімічних дисциплін", count: 10, checked: false },
];

const TeachersPage = () => {
  const [selectedCmk, setSelectedCmk] = React.useState(cmk);

  return (
    <RootContainer classNames="mb-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl">Циклові комісії</h2>

        <div className="flex items-center gap-2">
          <PopoverFilter
            items={cmk}
            itemsPrefix="ЦК"
            enableSelectAll
            filterVariant="default"
            selectedItems={selectedCmk}
            selectAllLabel="Вибрати всі"
            setSelectedItems={setSelectedCmk}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 flex-wrap mb-10">
        {cmk.map((item) => (
          <TeacherCard key={item.id} name={item.name} count={item.count} />
        ))}

        <Card className="shadow-none hover:border-primary min-h-[100px] flex items-center justify-center cursor-pointer border-dashed hover:text-primary">
          <p className="flex items-center gap-1">
            <Plus className="w-4" />
            <span className="text-sm">Створити нову</span>
          </p>
        </Card>
      </div>

      <h2 className="text-xl mb-4">Склад комісії</h2>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList>
          <TabsTrigger value="all">Всі (12)</TabsTrigger>
          <TabsTrigger value="active">Активні (8)</TabsTrigger>
          <TabsTrigger value="archive">Архів (4)</TabsTrigger>
        </TabsList>
      </Tabs>

      <InputSearch className="mb-8" placeholder="Пошук..." />

      <TeachersList />
    </RootContainer>
  );
};

export default TeachersPage;
