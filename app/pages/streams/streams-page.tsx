import React from "react";
import { ChevronsUpDown, Ellipsis, GraduationCap } from "lucide-react";

import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { StreamsLessonsTable } from "~/components/features/pages/streams/streams-lessons-table";
import { InputSearch } from "~/components/ui/custom/input-search";
import StreamsListDrawer from "~/components/features/pages/streams/streams-list-drawer";

const semesters = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
];

const streamsStatus = [
  { id: 1, name: "Активні" },
  { id: 2, name: "Архів" },
];

const StreamsPage = () => {
  const [selectedSemester, setSelectedSemester] = React.useState(semesters);
  const [selectedStreamStatus, setSelectedStreamStatus] = React.useState(streamsStatus);

  return (
    <RootContainer classNames="flex gap-10 !min-h-[calc(100vh-160px)]">
      <div className="flex flex-col flex-1">
        <div className="flex w-full justify-between items-center mb-4">
          <div className="">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 text-black/40" />
              <div className="text-black/40 text-sm">ПОТІК</div>
            </div>

            <div className="flex gap-3 items-center">
              <h2 className="text-2xl font-semibold">PH9-25-1-3</h2>
              <Badge variant="outline" className="text-primary bg-primary-light border-0">
                Активна
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <InputSearch placeholder="Знайти..." />

            <PopoverFilter
              enableSelectAll
              label="Семестри"
              items={semesters}
              itemsPrefix="Семестр"
              filterVariant="default"
              selectAllLabel="Вибрати всі"
              selectedItems={selectedSemester}
              setSelectedItems={setSelectedSemester}
            />

            <StreamsListDrawer />
          </div>
        </div>

        <StreamsLessonsTable />
      </div>
    </RootContainer>
  );
};

export default StreamsPage;
