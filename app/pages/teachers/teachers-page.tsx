import React from "react";
import { ListFilter, Plus, ChevronDown } from "lucide-react";

import { Card } from "~/components/ui/common/card";

import { Button } from "~/components/ui/common/button";
import { Checkbox } from "~/components/ui/common/checkbox";
import { RootContainer } from "~/components/layouts/root-container";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { TeachersList } from "~/components/features/pages/teachers/teachers-list";
import { CategoryCard } from "~/components/features/category-card/category-card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { Input } from "~/components/ui/common/input";
import { InputSearch } from "~/components/ui/custom/input-search";
import { TeacherCard } from "~/components/features/pages/teachers/teacher-card";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12, checked: true },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17, checked: false },
  { id: 3, name: "Гуманітарних дисциплін", count: 7, checked: true },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5, checked: true },
  { id: 5, name: "Хімічних дисциплін", count: 10, checked: false },
];

const TeachersPage = () => {
  return (
    <RootContainer classNames="mb-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl">Циклові комісії</h2>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
              // variant="outline"
              // className="bg-primary hover:bg-primary/90 text-primary-light hover:text-primary-light"
              >
                <ListFilter />
                <span className="hidden lg:inline">Фільтр</span>
                <span className="lg:hidden">Фільтр</span>
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all" />
                  <label
                    htmlFor="all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Всі ЦК
                  </label>
                </div>
                {cmk.map((item) => {
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox id={item.name} />
                      <label
                        htmlFor={item.name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        ЦК {item.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
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
