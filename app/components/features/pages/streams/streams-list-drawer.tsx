import { useSelector } from "react-redux";
import { type Dispatch, type FC, type SetStateAction } from "react";
import { ChevronsUpDown, Ellipsis, Plus, Trash } from "lucide-react";

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
import type {
  UpdatingCategoryType,
  CategoryModalStateType,
} from "../../category-actions-modal/category-actions-modal-types";
import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { onConfirm } from "../../confirm-modal";
import { Card } from "~/components/ui/common/card";
import { Button } from "~/components/ui/common/button";
import { ActionsDropdown } from "../../actions-dropdown";
import { streamsSelector } from "~/store/streams/streams-slice";
import type { StreamsType } from "~/store/streams/streams-types";
import { deleteStream } from "~/store/streams/streams-async-actions";
import { changeAlertModalStatus } from "~/store/general/general-slice";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface IStreamsListDrawerProps {
  isDrawerOpen: boolean;
  selectedStream: StreamsType | null;
  preSelectedStream: StreamsType | null;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setModalData: Dispatch<SetStateAction<CategoryModalStateType>>;
  setSelectedStream: Dispatch<SetStateAction<StreamsType | null>>;
  setPreSelectedStream: Dispatch<SetStateAction<StreamsType | null>>;
  setUpdatingStream: Dispatch<SetStateAction<UpdatingCategoryType | null>>;
}

const StreamsListDrawer: FC<IStreamsListDrawerProps> = ({
  isDrawerOpen,
  setModalData,
  selectedStream,
  setIsDrawerOpen,
  setSelectedStream,
  setUpdatingStream,
  preSelectedStream,
  setPreSelectedStream,
}) => {
  const dispatch = useAppDispatch();

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

  const onPreSelectStream = (stream: StreamsType) => {
    setPreSelectedStream((prev) => {
      if (!prev) return stream;
      if (prev.id !== stream.id) return stream;
      return null;
    });
  };

  const onSelectStream = () => {
    if (!preSelectedStream) return;
    setSelectedStream(preSelectedStream);
    setIsDrawerOpen(false);
  };

  const onClickUpdateFunction = (id: number) => {
    const selectedStream = streams.find((el) => el.id === id);
    if (selectedStream) {
      setUpdatingStream(selectedStream);
      setModalData({ isOpen: true, actionType: "update" });
    }
  };

  const onClickDeleteFunction = async (id: number) => {
    if (!streams) return;
    const selectedStream = streams.find((el) => el.id === id);
    if (!selectedStream) return;

    if (selectedStream.groups.length) {
      const alertPayload = {
        isOpen: true,
        title: "Видалення потоку неможливе",
        text: "Потік не може бути видалений, оскільки він містить пов’язані групи. Перед видаленням потоку необхідно спочатку видалити або перемістити всі групи, які до нього належать.",
      };
      dispatch(changeAlertModalStatus(alertPayload));
      return;
    }

    const confirmPayload = {
      isOpen: true,
      title: "Ви дійсно хочете видалити потік?",
      description: `Потік "${selectedStream.name}" буде видалено назавжди. Цю дію не можна відмінити.`,
    };
    const result = await onConfirm(confirmPayload, dispatch);
    if (result) {
      dispatch(deleteStream(id));
    }
  };

  return (
    <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <Button>Список потоків</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Потоки</DrawerTitle>
          <DrawerDescription>Список навчальних потоків</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Card
            onClick={() => setModalData({ isOpen: true, actionType: "create" })}
            className="shadow-none hover:border-primary h-[50px] mb-2 flex items-center justify-center cursor-pointer border-dashed hover:text-primary"
          >
            <p className="flex items-center gap-1">
              <Plus className="w-4" />
              <span className="text-sm">Створити новий</span>
            </p>
          </Card>

          {(streams ?? []).map((stream) => (
            <Collapsible className="py-2 px-4 border mb-2 hover:border-primary hover:cursor-pointer" key={stream.id}>
              <div className="flex items-center justify-between space-x-4" onClick={() => onPreSelectStream(stream)}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{stream.name}</p>
                </div>

                <div className="flex gap-1">
                  <ActionsDropdown
                    itemId={stream.id}
                    onClickDeleteFunction={onClickDeleteFunction}
                    onClickUpdateFunction={onClickUpdateFunction}
                  />

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
          {preSelectedStream ? (
            <p className="text-center font-mono">
              Вибрано потік: <b>{preSelectedStream.name}</b>
            </p>
          ) : (
            ""
          )}
          <Button onClick={onSelectStream} disabled={!preSelectedStream}>
            Вибрати
          </Button>
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
