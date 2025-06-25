import { useMemo, type FC } from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../common/dropdown-menu";
import { cn } from "~/lib/utils";
import { Button } from "../common/button";
import { sortByName } from "~/helpers/sort-by-name";

type IItem = {
  id: number;
  name: string;
} & any;

interface IDropdownSelectProps {
  label?: string;
  items: IItem[];
  classNames?: string;
  selectedItem: IItem | null;
  onChange: (id: number) => void;
}

const DropdownSelect: FC<IDropdownSelectProps> = ({ items, onChange, selectedItem, classNames = "", label = "" }) => {
  const active = items.find((el) => el.id === selectedItem);

  const memorizedItems = useMemo(() => sortByName(items), [items]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("flex justify-between shadow-0", classNames)}>
          <span className="truncate">{active ? active.name : label}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {memorizedItems.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            className="cursor-pointer"
            textValue={String(item.value)}
            checked={selectedItem === item.id}
            onClick={() => onChange(Number(item.id))}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;
