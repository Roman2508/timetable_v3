import { useSelector } from "react-redux";
import { type Dispatch, type FC, type SetStateAction } from "react";
import { ChevronsUpDown, Ellipsis, Trash } from "lucide-react";

import {
  Drawer,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
} from "~/components/ui/common/drawer";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/common/button";
import { streamsSelector } from "~/store/streams/streams-slice";
import type { StreamsType } from "~/store/streams/streams-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface IStreamsListDrawerProps {
  selectedStream: StreamsType | null;
  setSelectedStream: Dispatch<SetStateAction<StreamsType | null>>;
}

const StreamsListDrawer: FC<IStreamsListDrawerProps> = ({ selectedStream, setSelectedStream }) => {
  // const { streams } = useSelector(streamsSelector);

  const streams = [
    {
      id: 1,
      name: "test stream",
      groups: [
        {
          id: 2,
          name: "LD9-25-1",
        },
        {
          id: 1,
          name: "PH9-25-1",
        },
      ],
      lessons: [],
    },
    {
      id: 2,
      name: "test stream 2",
      groups: [],
      lessons: [],
    },
  ];

  const onSelectStream = (stream: StreamsType) => {
    setSelectedStream((prev) => {
      if (!prev) return stream;
      if (prev.id !== stream.id) return stream;
      return null;
    });
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger>
        <Button>Список потоків</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Потоки</DrawerTitle>
          <DrawerDescription>Список навчальних потоків</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {(streams ?? []).map((stream) => (
            <Collapsible className="py-2 px-4 border mb-2 hover:border-primary hover:cursor-pointer" key={stream.id}>
              <div className="flex items-center justify-between space-x-4" onClick={() => onSelectStream(stream)}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{stream.name}</p>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <Ellipsis className="w-4" />
                  </Button>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent className="py-2 mb-2 ml-4">
                {stream.groups.length ? (
                  stream.groups.map((group) => (
                    <div
                      key={group.id}
                      className={cn(
                        "border pl-4 mb-2 font-mono text-sm cursor-pointer hover:border-primary hover:text-primary flex justify-between items-center",
                      )}
                    >
                      {group.name}

                      <Tooltip delayDuration={500}>
                        <TooltipTrigger>
                          <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Видалити групу з потоку</TooltipContent>
                      </Tooltip>
                    </div>
                  ))
                ) : (
                  <div className="font-mono text-sm">До потоку ще не додано жодної групи</div>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <DrawerFooter>
          {selectedStream ? (
            <p className="text-center font-mono">
              Вибрано потік: <b>{selectedStream.name}</b>
            </p>
          ) : (
            ""
          )}
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
