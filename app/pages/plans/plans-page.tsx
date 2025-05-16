import { ChevronsUpDown, Ellipsis, GripVertical } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

const plans = [
  { id: 1, name: "Фармація, промислова фармація (денна форма)", count: 12, checked: true },
  { id: 2, name: "Технології медичної діагностики та лікування", count: 17, checked: false },
  { id: 3, name: "Фармація, промислова фармація (заочна форма)", count: 7, checked: true },
];

export default function PlansPage() {
  return (
    <RootContainer>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl">Навчальні плани</h2>

        <div className="flex items-center gap-2">
          <Button variant="outline">Створити новий</Button>

          <Button>Filters</Button>
        </div>
      </div>

      {[
        "І8 Фармація 2024",
        "І6 Технології медичної діагностики та лікування 2024",
        "І8 Фармація 2025",
        "І6 Технології медичної діагностики та лікування 2025",
      ].map((el) => (
        <Collapsible className="py-2 px-4 border mb-2">
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-sm font-semibold">{el}</h4>

            <div className="flex gap-2">
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <Ellipsis className="w-4" />
              </Button>

              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <GripVertical className="w-4" />
              </Button>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="py-2 mb-2 ml-4">
            {[
              "226 Фармація, промислова фармація ОПС ФМБ (БСО) 2024",
              "І8 Фармація ОПС ФМБ (БСО) 2024",
              "І6 Технології медичної діагностики та лікування ОПС ФМБ (БСО) 2024",
              "226 Фармація, промислова фармація ОПС ФМБ (ПЗСО) 2025",
            ].map((lessonType) => (
              <div
                className={cn(
                  "border px-4 py-2 mb-2 font-mono text-sm cursor-pointer hover:border-primary hover:text-primary",
                )}
              >
                {lessonType} (вся група)
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </RootContainer>
  );
}
