import React from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/common/dropdown-menu";
import { Button } from "../ui/common/button";

type ItemType = {
  id: number | string;
  name: string;
  [key: string]: any;
};

interface IEntitiesDropdownProps {
  items: ItemType[];
  disabled?: boolean;
  itemPrefix?: string;
  activeItem?: ItemType;
  onChangeSelected: (id: number | string) => void;
}

const EntitiesDropdown: React.FC<IEntitiesDropdownProps> = ({
  items,
  activeItem,
  onChangeSelected,
  disabled = false,
  itemPrefix = "",
}) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          disabled={disabled}
          className={`flex justify-between w-full shadow-0 bg-sidebar`}
        >
          <span className="lg:inline">{activeItem ? activeItem.name : ""}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        style={{ width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : `auto` }}
      >
        {items.map((item) => {
          return (
            <DropdownMenuCheckboxItem
              key={item.id}
              className="capitalize"
              checked={item.id === activeItem?.id}
              onCheckedChange={() => {
                onChangeSelected(item.id);
              }}
            >
              {itemPrefix} {item.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EntitiesDropdown;
