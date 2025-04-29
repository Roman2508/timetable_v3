import React from "react";
import { Ellipsis, GraduationCap, Trash } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { TeachersList } from "~/components/features/pages/teachers/teachers-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/common/accordion";

const cmk = [
  { id: 1, name: "Загальноосвітніх дисциплін", count: 12, checked: true },
  { id: 2, name: "Фармацевтичних дисциплін", count: 17, checked: false },
  { id: 3, name: "Гуманітарних дисциплін", count: 7, checked: true },
  { id: 4, name: "Медико-біологічних дисциплін", count: 5, checked: true },
  { id: 5, name: "Хімічних дисциплін", count: 10, checked: false },
];

const streamsStatus = [
  { id: 1, name: "Активні" },
  { id: 2, name: "Архів" },
];

const plans = [
  { id: 1, name: "Фармація, промислова фармація (денна форма)", count: 12, checked: true },
  { id: 2, name: "Технології медичної діагностики та лікування", count: 17, checked: false },
  { id: 3, name: "Фармація, промислова фармація (заочна форма)", count: 7, checked: true },
];

const StreamsPage = () => {
  const [selectedCmk, setSelectedCmk] = React.useState(cmk);
  const [selectedStreamStatus, setSelectedStreamStatus] = React.useState(streamsStatus);

  return (
    <RootContainer classNames="flex gap-4 !h-[calc(100vh-160px)]">
      <div className="flex flex-col flex-1">
        <div className="flex w-full justify-between items-center mb-4">
          <div className="">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 text-black/40" />
              <div className="text-black/40 text-sm">ГРУПА</div>
            </div>

            <div className="flex gap-3 items-center">
              <h2 className="text-2xl font-semibold">PH9-25-1</h2>
              <Badge variant="outline" className="text-primary bg-primary-light border-0">
                Активна
              </Badge>
            </div>
          </div>

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

        <Card className="w-full">
          <TeachersList />
        </Card>
      </div>

      <div className="w-90 border-l pl-4 h-full">
        <div className="h-[56px] mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Потоки:</h2>
          <PopoverFilter
            items={streamsStatus}
            filterVariant="default"
            selectedItems={selectedStreamStatus}
            setSelectedItems={setSelectedStreamStatus}
          />
        </div>

        {[...Array(4)].map((_, index) => (
          <Accordion type="single" key={index} className="mb-4" collapsible>
            <AccordionItem value={`item-${index}`} className="pb-0">
              <AccordionTrigger
                className="p-2 cursor-pointer"
                actions={
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <Ellipsis className="w-4" />
                  </Button>
                }
              >
                <div className="flex items-center gap-2">
                  <p>PH9-24-1-3</p>
                  <Badge variant="outline" className="text-primary bg-primary-light border-0">
                    Активний
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="">
                  {[...plans].map((item) => (
                    <div className="flex justify-between items-center border-t py-2 m-0">
                      <p>Group Name</p>
                      <Button variant="outline" className="p-1 h-7 w-7">
                        <Trash className="!w-3 !h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </RootContainer>
  );
};

export default StreamsPage;
