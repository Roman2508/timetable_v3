import React from "react";
import { ChevronLeft, CircleX, CopyPlus, CopyX, GraduationCap, Search, SquarePlus } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { DistributionLessonsTable } from "~/components/features/pages/distribution/distribution-lessons-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/common/accordion";

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

const lessonsTabs = [
  {
    icon: <CopyX />,
    label: "Одна дисципліна",
    name: "unpin_all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CircleX />,
    label: "Всі дисципліни",
    name: "unpin_one",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
];

const StudentsDividePage = () => {
  const [selectedSemesters, setSelectedSemesters] = React.useState(semesters);
  const [selectedSmk, setSelectedCmk] = React.useState(cmk);

  return (
    <RootContainer classNames="max-h-[calc(100vh-160px)] overflow-hidden">
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

      <div className="flex w-full h-full gap-3">
        <Card className="p-3 pr-0 flex-1 h-[calc(100vh-240px)]">
          {/* <div className="flex gap-4 justify-between">
            <InputSearch className="w-full" />

            <PopoverFilter
              enableSelectAll
              items={semesters}
              itemsPrefix="Семестр"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSemesters}
              setSelectedItems={setSelectedSemesters}
            />
          </div> */}

          <h3 className="font-semibold">Студенти групи PH9-25-1</h3>

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1">
                {index + 1}. Test Student Name{index}
              </option>
            ))}
          </select>
        </Card>

        <Card className="t-3 pl-3 flex-1 gap-0 h-[calc(100vh-240px)]">
          <h3 className="text-md font-semibold text-center pb-3">Дисципліни</h3>

          <div className="flex gap-2 justify-center mb-8 py-2 border-y">
            <Tabs defaultValue="attach_all">
              <TabsList>
                {lessonsTabs.map((el) => (
                  <TabsTrigger key={el.name} value={el.name} className="px-3 py-2 w-40">
                    {el.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-y-auto pr-3">
            {[
              "Інформаційні технології у фармації",
              "Фармакологія",
              "Органічна хімія",
              "Ділова іноземна мова (B1)",
              "Технологія ліків",
              "Інформаційні технології у фармації",
              "Фармакологія",
              "Органічна хімія",
              "Ділова іноземна мова (B1)",
              "Технологія ліків",
              "Інформаційні технології у фармації",
              "Фармакологія",
              "Органічна хімія",
              "Ділова іноземна мова (B1)",
              "Технологія ліків",
            ].map((el) => (
              <Accordion type="single" className="mb-2" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="py-1 px-2">{el}</AccordionTrigger>
                  <AccordionContent className="pb-0">
                    {["ЛК", "ПЗ", "СЕМ", "ЕКЗ"].map((el) => (
                      <div className="pb-2 mb-2 border-b">{el} (вся група)</div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </Card>

        <Card className="p-3 flex-1 h-[calc(100vh-240px)]">
          {/* <div className="flex gap-4 justify-between">
            <InputSearch className="w-full" />

            <PopoverFilter
              enableSelectAll
              items={cmk}
              itemsPrefix="ЦК"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSmk}
              setSelectedItems={setSelectedCmk}
            />
          </div> */}

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1">
                {index + 1}. Abcdefghijklmnstorvwzyz{index}
              </option>
            ))}
          </select>
        </Card>
      </div>
    </RootContainer>
  );
};

export default StudentsDividePage;
