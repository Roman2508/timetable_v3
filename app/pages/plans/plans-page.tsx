import { Ellipsis, PenLine, Plus, Trash, User } from "lucide-react";
import { CategoryCard } from "~/components/features/category-card/category-card";
import { RootContainer } from "~/components/layouts/root-container";
import { Card, CardFooter, CardHeader, CardAction, CardDescription } from "~/components/ui/common/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/common/accordion";
import { TeachersList } from "~/components/features/pages/teachers/teachers-list";
import { Button } from "~/components/ui/common/button";
import { Badge } from "~/components/ui/common/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/common/tooltip";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/common/dropdown-menu";
import PlanCard from "~/components/features/pages/plans/plan-card";

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

        <div className="flex items-center gap-2"></div>
      </div>

      {[...Array(4)].map((_, index) => (
        <Accordion type="single" key={index} className="mb-4" collapsible>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger
              actions={
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                  <Ellipsis className="w-4" />
                </Button>
              }
            >
              226 Фармація, промислова фармація ОПС ФМБ (БСО) 2024
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-4 flex-wrap mb-10">
                {[...plans, ...plans].map((item) => (
                  <PlanCard key={item.id} lessonsCount={item.count} groupsCount={item.count - 8} name={item.name} />
                ))}

                <Card className="hover:border-primary min-h-[90px] flex items-center justify-center cursor-pointer border-dashed hover:text-primary">
                  <p className="flex items-center gap-1">
                    <Plus className="w-4" />
                    <span className="text-sm">Створити новий</span>
                  </p>
                </Card>
              </div>
              {/* <TeachersList /> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </RootContainer>
  );
}
