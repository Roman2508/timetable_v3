import React from "react";
import { ArrowUpDown, Ellipsis, PenLine, Reply, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "~/components/ui/common/dropdown-menu";
import { Button } from "~/components/ui/common/button";

type CategoriesType = {
  id: number;
  name: string;
  count: number;
  [key: string]: any;
};

interface IActionsDropdownProps {
  itemId: number;
  categoryPrefix?: string;
  categoriesList?: CategoriesType[];
  onClickUpdateFunction?: (id: number) => void;
  onClickDeleteFunction?: (id: number) => void;
  changeStatusFunction?: (id: number) => void;
  changeCategoryFunction?: (id: number, categoryId: number) => void;
}

const ActionsDropdown: React.FC<IActionsDropdownProps> = ({
  itemId,
  categoryPrefix,
  categoriesList,
  changeStatusFunction,
  onClickUpdateFunction,
  onClickDeleteFunction,
  changeCategoryFunction,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Ellipsis className="w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {onClickUpdateFunction && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => onClickUpdateFunction(itemId)}>
            <PenLine />
            Оновити
          </DropdownMenuItem>
        )}

        {changeCategoryFunction && !!categoriesList?.length && (
          <DropdownMenuGroup className="cursor-pointer">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Reply className="w-4 mr-2 opacity-70" />
                Змінти підрозділ
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {categoriesList.map((item) => {
                    return (
                      <DropdownMenuItem key={item.id} onClick={() => changeCategoryFunction(itemId, item.id)}>
                        {categoryPrefix} {item.name} ({item.count})
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        )}

        {changeStatusFunction && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => changeStatusFunction(itemId)}>
            <ArrowUpDown />
            Змінити статус
          </DropdownMenuItem>
        )}

        {onClickDeleteFunction && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => onClickDeleteFunction(itemId)}>
            <Trash />
            Видалити
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ActionsDropdown };
