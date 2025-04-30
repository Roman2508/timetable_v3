import React from "react";
import { ChevronLeft, CircleX, CopyPlus, CopyX, GraduationCap, Search, SquarePlus } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { DistributionLessonsTable } from "~/components/features/pages/distribution/distribution-lessons-table";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12 },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17 },
  { id: 3, name: "Гуманітарних дисциплін", count: 7 },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5 },
  { id: 5, name: "Хімічних дисциплін", count: 10 },
];

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
];

const distributionVariants = [
  {
    icon: <CopyX />,
    tooltip: "Відкріпити всі",
    name: "unpin_all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CircleX />,
    tooltip: "Відкріпити одного",
    name: "unpin_one",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CopyPlus />,
    tooltip: "Прикріпити всі",
    name: "attach_all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <SquarePlus />,
    tooltip: "Прикріпити одного",
    name: "attach_one",
    onClick: () => {},
    disabled: false,
    isActive: true,
  },
];

const StudentsDividePage = () => {
  const [selectedSemesters, setSelectedSemesters] = React.useState(semesters);
  const [selectedSmk, setSelectedCmk] = React.useState(cmk);

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

            <PopoverFilter
              enableSelectAll
              items={semesters}
              itemsPrefix="Семестр"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSemesters}
              setSelectedItems={setSelectedSemesters}
            />
          </div>

          <DistributionLessonsTable />
        </Card>

        <Card className="p-3 flex-1 gap-0">
          <h3 className="text-md font-semibold text-center pb-3">Інформаційні технології у фармації</h3>

          <div className="flex gap-2 justify-center mb-8 py-2 border-y">
            <Tabs defaultValue="attach_one">
              <TabsList>
                {distributionVariants.map((el) => (
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger>
                      <TabsTrigger key={el.name} value={el.name} className="px-3 py-2">
                        {el.icon}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>{el.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="">
            {["ЛК", "ПЗ", "ЛАБ", "СЕМ", "ЕКС", "КОНС"].map((el) => (
              <div className="flex justify-between items-center gap-4 mb-4">
                <p className="min-w-30">{el}</p>
                <Input className="cursor-default" readOnly value="" />
                <Input className="max-w-20 cursor-default" readOnly value={20} />
                <Button variant="outline">
                  <ChevronLeft />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch className="w-full" />

            <PopoverFilter
              enableSelectAll
              items={cmk}
              itemsPrefix="ЦК"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSmk}
              setSelectedItems={setSelectedCmk}
            />
          </div>

          <DistributionLessonsTable />
        </Card>
      </div>
    </RootContainer>
  );
};

export default StudentsDividePage;
