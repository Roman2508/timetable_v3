import React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { Button } from "~/components/ui/common/button";
import { SelectGroupTable } from "./select-group-table";
import { Separator } from "~/components/ui/common/separator";
import { InputSearch } from "~/components/ui/custom/input-search";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

const SelectGroupModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Search />
          Вибрати групу
        </Button>
      </DialogTrigger>

      <DialogContent className="px-0 max-w-[600px]">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">Виберіть групу:</DialogTitle>
          <p className="leading-[1.25] opacity-[.6]">Виберіть групу, яка буде використовуватись для подальших дій</p>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <InputSearch className="mb-4 mx-4 mr-6" placeholder="Знайти групу..." />

          <div className="min-h-[40vh] max-h-[50vh] overflow-y-auto px-4">
            {[
              "І8 Фармація. Денна форма",
              "І8 Фармація. Заочна форма",
              "І6 Технології медичної діагностики та лікування",
            ].map((el) => (
              <Collapsible className="pt-2 border mb-4" defaultOpen>
                <div className="flex items-center justify-between pl-4 pb-2 pr-2">
                  <h4 className="text-sm font-semibold">{el}</h4>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2">
                  <SelectGroupTable />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex !justify-between items-center pt-2 px-4">
          <Button>Вибрати</Button>

          <div className="font-mono mr-3">
            Вибрано групу:
            <span className="font-bold"> PH9-25-1</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectGroupModal;
