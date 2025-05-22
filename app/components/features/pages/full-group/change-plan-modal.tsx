import React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { InputSearch } from "~/components/ui/custom/input-search";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface IChangePlanModalProps {
  isOpen: boolean;
  setOpenedModalName: React.Dispatch<React.SetStateAction<string>>;
}

const PLANS = [
  {
    id: 1,
    name: "І8 Фармація. Денна форма",
    plans: [
      { id: 1, name: "І8 Фармація 2024 (1)" },
      { id: 2, name: "І6 Технології медичної діагностики та лікування 2024 (1)" },
      { id: 3, name: "І8 Фармація 2025 (1)" },
      { id: 4, name: "І6 Технології медичної діагностики та лікування 2025 (1)" },
    ],
  },
  {
    id: 2,
    name: "І8 Фармація. Заочна форма",
    plans: [
      { id: 5, name: "І8 Фармація 2024 (2)" },
      { id: 6, name: "І6 Технології медичної діагностики та лікування 2024 (2)" },
      { id: 7, name: "І8 Фармація 2025 (2)" },
      { id: 8, name: "І6 Технології медичної діагностики та лікування 2025 (2)" },
    ],
  },
  {
    id: 3,
    name: "І6 Технології медичної діагностики та лікування",
    plans: [
      { id: 9, name: "І8 Фармація 2024 (3)" },
      { id: 10, name: "І6 Технології медичної діагностики та лікування 2024 (3)" },
      { id: 11, name: "І8 Фармація 2025 (3)" },
      { id: 12, name: "І6 Технології медичної діагностики та лікування 2025 (3)" },
    ],
  },
];

const ChangePlanModal: React.FC<IChangePlanModalProps> = ({ isOpen, setOpenedModalName }) => {
  const columns = React.useMemo<{ label: string; key: string }[]>(() => [{ label: "Назва", key: "name" }], []);

  const [selectedPlan, setSelectedPlan] = React.useState({ id: 0, name: "" });

  const onOpenChange = () => {
    setOpenedModalName((prev) => (prev === "plan" ? "" : "plan"));
  };

  // Треба додати window.confirm після зміни плану, якщо був раніше обраний інший (попередження про те, що все
  // старе навчальне навантаження буде видалено, і замість нього буде створено нове на основі нового навчального плану)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть навчальний план:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">
            Виберіть навчальний план, який буде використовуватись для формування навантаження групи
          </p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <InputSearch className="mb-4 mx-4 mr-6" placeholder="Знайти навчальний план..." />

          <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
            {PLANS.map((el) => (
              <Collapsible className="pt-2 border mb-4" key={el.id} defaultOpen>
                <div className="flex items-center justify-between pl-4 pb-2 pr-2">
                  <h4 className="text-sm font-semibold">{el.name}</h4>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2">
                  <div className="">
                    <div className="flex px-4 py-2 border-b">
                      {columns.map((el) => (
                        <div key={el.key} className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">
                          {el.label}
                        </div>
                      ))}
                    </div>

                    <div>
                      {el.plans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => {
                            setSelectedPlan({ name: plan.name, id: plan.id });
                          }}
                          className={cn(
                            "hover:border hover:border-primary cursor-pointer",
                            "flex px-4 py-2 border border-white border-t-border",
                            plan.id === selectedPlan.id
                              ? "border border-primary text-primary bg-primary-light font-semibold"
                              : "",
                          )}
                        >
                          {plan.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button disabled={!selectedPlan.id}>Зберегти</Button>

          <div className="font-mono mr-3 text-right flex flex-col">
            {selectedPlan.name ? (
              <>
                <p className="font-bold leading-5">Вибраний навчальний план:</p>
                <span className="text-sm">І6 Технології медичної діагностики та лікування 2024</span>
              </>
            ) : (
              "Навчальний план не вибрано"
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePlanModal;
