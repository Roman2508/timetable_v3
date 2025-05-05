import { ChevronsUpDown, Ellipsis, GripVertical } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/common/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/common/dialog";
import { cn } from "~/lib/utils";

const SelectGroupModal = () => {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Виберіть групу:</DialogTitle>
        </DialogHeader>

        <DialogDescription className="h-[70vh] overflow-y-auto">
          {[
            "І8 Фармація. Денна форма",
            "І8 Фармація. Заочна форма",
            "І6 Технології медичної діагностики та лікування",
          ].map((el) => (
            <Collapsible className="py-2 px-4 border mb-2">
              <div className="flex items-center justify-between space-x-4">
                <h4 className="text-sm font-semibold">{el}</h4>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="py-2 mb-2 ml-4">
                {[
                  "PH11-25-1",
                  "PH9-24-1",
                  "LD9-23-2",
                  "PH11-23-2",
                  "PH11-25-1",
                  "PH9-24-1",
                  "LD9-23-2",
                  "PH11-23-2",
                ].map((lessonType) => (
                  <div
                    className={cn(
                      "border px-4 py-2 mb-2 font-mono text-sm cursor-pointer hover:border-primary hover:text-primary",
                    )}
                  >
                    {lessonType}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </DialogDescription>

        <DialogFooter className="flex justify-end">
          {/* <div className="flex justify-end"> */}
          <Button>Вибрати</Button>
          {/* </div> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectGroupModal;
