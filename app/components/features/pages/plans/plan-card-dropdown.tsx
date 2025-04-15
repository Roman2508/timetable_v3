import { Ellipsis, PenLine, Trash } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/common/button";
import { CardAction } from "~/components/ui/common/card";
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

const PlanCardDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CardAction>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Ellipsis className="w-4" />
          </Button>
        </CardAction>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>
          <PenLine />
          Редагувати
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Trash />
          Видалити
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlanCardDropdown;
