import { useEffect, useState } from "react";
import { ChevronLeft, CircleX, CopyPlus, CopyX, GraduationCap, SquarePlus } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import EntityHeader from "~/components/features/entity-header";
import { InputSearch } from "~/components/ui/custom/input-search";
import type { GroupsShortType } from "~/store/groups/groups-types";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import SelectGroupModal from "~/components/features/select-group/select-group-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { DistributionLessonsTable } from "~/components/features/pages/distribution/distribution-lessons-table";
import { useSelector } from "react-redux";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import { DistributionTeacherTable } from "~/components/features/pages/distribution/distribution-teacher-table";

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

const DistributionPage = () => {
  const [selectedSmk, setSelectedCmk] = useState(cmk);
  const [selectedSemesters, setSelectedSemesters] = useState(semesters);
  const [selectedGroup, setSelectedGroup] = useState<GroupsShortType | null>(null);

  useEffect(() => {
    //
  }, [selectedGroup]);

  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          {selectedGroup ? (
            <EntityHeader label="ГРУПА" name={selectedGroup.name} status={selectedGroup.status} Icon={GraduationCap} />
          ) : (
            <div className="flex items-center h-[56px]">
              <h2 className="text-lg font-semibold">Виберіть групу для розподілу навантаження</h2>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <SelectGroupModal setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch value="" className="w-full" placeholder="Знайти..." onChange={(e) => {}} />

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
                <Input className="max-w-13 cursor-default" readOnly value={120} />
                <Button variant="outline">
                  <ChevronLeft />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3 flex-1">
          <div className="flex gap-4 justify-between">
            <InputSearch value={""} className="w-full" placeholder="Знайти..." onChange={(e) => {}} />

            <PopoverFilter
              enableSelectAll
              items={cmk}
              itemsPrefix="ЦК"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSmk}
              setSelectedItems={setSelectedCmk}
            />
          </div>

          <DistributionTeacherTable globalFilter="" setGlobalFilter={() => {}} />
        </Card>
      </div>
    </RootContainer>
  );
};

export default DistributionPage;
