import {
  ChevronDown,
  CircleX,
  CopyPlus,
  CopyX,
  FolderSearch2,
  GraduationCap,
  ListFilter,
  Package,
  Pencil,
  Search,
  SquarePlus,
  TextSearch,
  Trash,
  Trash2,
} from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { DistributionLessonsTable } from "~/components/features/pages/distribution/distribution-lessons-table";
import { Input } from "~/components/ui/common/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { InputSearch } from "~/components/ui/custom/input-search";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { Checkbox } from "~/components/ui/common/checkbox";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12, checked: true },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17, checked: false },
  { id: 3, name: "Гуманітарних дисциплін", count: 7, checked: true },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5, checked: true },
  { id: 5, name: "Хімічних дисциплін", count: 10, checked: false },
];

const DistributionPage = () => {
  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {true ? (
            <div className="flex flex-col h-[56px]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 text-black/40" />
                <div className="text-black/40 text-sm">ГРУПА</div>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">PH9-25-1</h2>
                <Badge variant="outline" className="text-primary bg-primary-light border-0">
                  Активна
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для розподілу навантаження</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button>
            <Search />
            Вибрати групу
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch className="w-full" />

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
                      Всі семестри
                    </label>
                  </div>
                  {["1", "2", "3", "4", "5", "6"].map((item) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox id={item} />
                        <label
                          htmlFor={item}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Семестр {item}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <DistributionLessonsTable />
        </Card>

        <Card className="p-3 flex-1 gap-0">
          <h3 className="text-md font-semibold text-center pb-3">Інформаційні технології у фармації</h3>

          <div className="flex gap-2 justify-center mb-8 py-2 border-y">
            {[
              { icon: <CopyX />, tooltip: "Відкріпити всі", onClick: () => {}, disabled: false },
              { icon: <CircleX />, tooltip: "Відкріпити одного", onClick: () => {}, disabled: false },
              { icon: <CopyPlus />, tooltip: "Прикріпити всі", onClick: () => {}, disabled: false },
              { icon: <SquarePlus />, tooltip: "Прикріпити одного", onClick: () => {}, disabled: false },
            ].map((el) => (
              <Tooltip delayDuration={500}>
                <TooltipTrigger>
                  <Button variant="outline">{el.icon}</Button>
                </TooltipTrigger>
                <TooltipContent>{el.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="">
            {["ЛК", "ПЗ", "ЛАБ", "СЕМ", "ЕКС", "КОНС"].map((el) => (
              <div className="flex justify-between items-center gap-4 mb-4">
                <p className="min-w-30">{el}</p>
                <Input className="cursor-default" readOnly value="" />
                <Input className="max-w-20 cursor-default" readOnly value={20} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch className="w-full" />

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
                  {cmk.map((cmk) => {
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox id={cmk.name} />
                        <label
                          htmlFor={cmk.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          ЦК {cmk.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <DistributionLessonsTable />
        </Card>
      </div>
    </RootContainer>
  );
};

export default DistributionPage;
