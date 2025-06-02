import React, { useState, type FC } from "react";
import { ChevronDown, ListFilter, PenLine, Plus } from "lucide-react";

import { Button } from "~/components/ui/common/button";
import { Checkbox } from "~/components/ui/common/checkbox";
import type { PlanSubjectType } from "~/store/plans/plans-types";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import type { PlanItemType, SemesterHoursType } from "~/helpers/group-lessons-by-name";
import { FullPlanTable } from "~/components/features/pages/full-plan/full-plan-table";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import SemesterHoursModal from "~/components/features/pages/full-plan/semester-hours-modal";
import SemesterDetailsModal from "~/components/features/pages/full-plan/semester-details-modal";

interface IFullPlanPageProps {
  planSubjects: PlanSubjectType[];
}

const FullPlanPage: FC<IFullPlanPageProps> = ({ planSubjects }) => {
  const [globalSearch, setGlobalSearch] = useState("");
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedSemesterHours, setSelectedSemesterHours] = useState<SemesterHoursType | null>(null);

  return (
    <>
      <SemesterHoursModal
        isOpen={isHoursModalOpen}
        setIsOpen={setIsHoursModalOpen}
        selectedSemesterHours={selectedSemesterHours}
        setSelectedSemesterHours={setSelectedSemesterHours}
      />

      <SemesterDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        selectedSemesterHours={selectedSemesterHours}
        setSelectedSemesterHours={setSelectedSemesterHours}
      />

      <RootContainer>
        <div>
          <h1 className="text-2xl mb-4 flex items-center gap-1">
            <span>I8 Фармація, промислова фармація ОПС ФМБ (заочна форма навчання) 2024</span>
            <Button variant="ghost">
              <PenLine />
            </Button>
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <InputSearch
              className="w-full"
              value={globalSearch}
              placeholder="Пошук..."
              onChange={(e) => setGlobalSearch(e.target.value)}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <ListFilter />
                  <span className="hidden lg:inline">Фільтр</span>
                  <span className="lg:hidden">Фільтр</span>
                  <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-50">
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
            <Button variant="default">
              <Plus />
              <span>Створити</span>
            </Button>
          </div>

          <FullPlanTable
            globalSearch={globalSearch}
            planSubjects={planSubjects}
            setGlobalSearch={setGlobalSearch}
            setIsHoursModalOpen={setIsHoursModalOpen}
            setIsDetailsModalOpen={setIsDetailsModalOpen}
            setSelectedSemesterHours={setSelectedSemesterHours}
          />
        </div>
      </RootContainer>
    </>
  );
};

export default FullPlanPage;
