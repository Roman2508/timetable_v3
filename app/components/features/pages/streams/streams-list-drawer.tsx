import React from "react";
import { ChevronsUpDown, Ellipsis, Trash } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/common/drawer";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";

const StreamsListDrawer = () => {
  return (
    <Drawer direction="right">
      <DrawerTrigger>
        <Button>Список потоків</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Потоки</DrawerTitle>
          <DrawerDescription>Список навчальних потоків</DrawerDescription>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Всі (12)</TabsTrigger>
              <TabsTrigger value="active">Активні (8)</TabsTrigger>
              <TabsTrigger value="archive">Архів (4)</TabsTrigger>
            </TabsList>
          </Tabs>
        </DrawerHeader>

        <div className="px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {[...Array(4)].map((_, index) => (
            <Collapsible className="py-2 px-4 border mb-2 hover:border-primary hover:cursor-pointer" key={index}>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">PH9-24-1-3</p>
                  <Badge variant="outline" className="text-primary bg-primary-light border-0">
                    Активний
                  </Badge>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <Ellipsis className="w-4" />
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
                {["PH11-25-1", "PH9-24-1", "LD9-23-2", "LD9-23-2", "PH11-23-2"].map((groupName) => (
                  <div
                    className={cn(
                      "border pl-4 mb-2 font-mono text-sm cursor-pointer hover:border-primary hover:text-primary flex justify-between items-center",
                    )}
                  >
                    {groupName}

                    <Tooltip delayDuration={500}>
                      <TooltipTrigger>
                        <Button variant="ghost">
                          <Trash />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Видалити групу з потоку</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <DrawerFooter>
          <Button>Вибрати</Button>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Закрити
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default StreamsListDrawer;
