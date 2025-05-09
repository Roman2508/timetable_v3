import React from "react";
import {
  ChevronLeft,
  ChevronsUpDown,
  CircleX,
  CopyPlus,
  CopyX,
  GraduationCap,
  Search,
  SquarePlus,
  UserMinus,
  UserPlus,
} from "lucide-react";

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import { cn } from "~/lib/utils";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12 },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17 },
  { id: 3, name: "Гуманітарних дисциплін", count: 7 },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5 },
  { id: 5, name: "Хімічних дисциплін", count: 10 },
];

const lessonsTabs = [
  {
    icon: <CopyX />,
    label: "Одна дисципліна",
    name: "one",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
  {
    icon: <CircleX />,
    label: "Всі дисципліни",
    name: "all",
    onClick: () => {},
    disabled: false,
    isActive: false,
  },
];

const StudentsDividePage = () => {
  const [activeLesson, setActiveLesson] = React.useState("");

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

      <div className="flex w-full gap-3 !h-[calc(100vh-240px)]">
        <Card className="p-3 pr-0 flex-1">
          <h3 className="font-semibold">Студенти групи PH9-25-1</h3>

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1 text-sm">
                {index + 1}. Test Student Name{index}
              </option>
            ))}
          </select>
        </Card>

        <div className="flex-1">
          <Card className="mb-3 p-0 gap-2 flex-row justify-center items-center h-10">
            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="ghost">
                  <UserPlus />
                  Зарахувати
                </Button>
              </TooltipTrigger>
              <TooltipContent>Зарахувати вибраних студентів на дисципліну</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={500}>
              <TooltipTrigger>
                <Button variant="ghost">
                  <UserMinus />
                  Відрахувати
                </Button>
              </TooltipTrigger>
              <TooltipContent>Відрахувати вибраних студентів з дисципліни</TooltipContent>
            </Tooltip>
          </Card>

          <div className="flex gap-2 mb-3 w-full">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full">
                {lessonsTabs.map((el) => (
                  <TabsTrigger key={el.name} value={el.name} className="h-[40px] w-full flex-1">
                    {el.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Card className="pt-3 flex-1 h-[calc(100vh-288px)]">
            <div className="overflow-y-auto overflow-x-hidden pr-3">
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
                <Collapsible className="space-y-2">
                  <div className="flex items-center justify-between space-x-4 pl-4">
                    <h4 className="text-sm font-semibold">{el}</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-2 mb-4 ml-4">
                    {["ЛК", "ПЗ", "СЕМ", "ЕКЗ"].map((lessonType) => (
                      <div
                        className={cn(
                          "border px-4 py-2 font-mono text-sm cursor-pointer",
                          `${el}_${lessonType}` === activeLesson ? "border-primary text-primary" : "",
                        )}
                        onClick={() => setActiveLesson(`${el}_${lessonType}`)}
                      >
                        {lessonType} (вся група)
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-3 pr-0 flex-1">
          <h3 className="font-semibold">Інформаційні технології у фармації</h3>

          <select multiple className="h-full border-0 outline-0">
            {[...Array(30)].map((_, index) => (
              <option value={index} className="p-1 text-sm">
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
