import React from "react";
import {
  ArrowRightFromLine,
  ChevronLeft,
  CircleX,
  CopyPlus,
  CopyX,
  Download,
  GraduationCap,
  Import,
  MessageCircleQuestion,
  Repeat2,
  Search,
  SquarePlus,
} from "lucide-react";

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
import { StudentsAccountsTable } from "~/components/features/pages/students-accounts/students-accounts-table";
import SelectGroupModal from "~/components/features/select-group/select-group-modal";

const StudentsAccountsPage = () => {
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
          <Button variant="outline">
            <MessageCircleQuestion />
          </Button>

          <Button variant="outline">
            <ArrowRightFromLine className="rotate-270" />
          </Button>

          <Button variant="outline">
            <Download />
          </Button>

          <Button variant="outline">
            <Repeat2 />
          </Button>

          <SelectGroupModal />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList>
          <TabsTrigger value="all">Всі (12)</TabsTrigger>
          <TabsTrigger value="study">Навчається (8)</TabsTrigger>
          <TabsTrigger value="aaa">Відраховано (4)</TabsTrigger>
          <TabsTrigger value="bbb">Академ.відпустка (4)</TabsTrigger>
        </TabsList>
      </Tabs>

      <InputSearch className="w-full mb-6" placeholder="Знайти..." />

      <StudentsAccountsTable />
    </RootContainer>
  );
};

export default StudentsAccountsPage;
