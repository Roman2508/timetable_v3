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
import { sortById } from "~/helpers/sort-by-id";
import { sortByName } from "~/helpers/sort-by-name";

type IItem = { id: number; name: string } & any;

interface IDropdownSelectProps {
  label?: string;
  items: IItem[];
  classNames?: string;
  sortBy?: "name" | "id";
  selectedItem: IItem | null;
  onChange: (id: number) => void;
}

const DropdownSelect: FC<IDropdownSelectProps> = ({
  items,
  onChange,
  selectedItem,
  label = "",
  classNames = "",
  sortBy = "name",
}) => {
  const active = items.find((el) => el.id === selectedItem);

  const memorizedItems = useMemo(() => {
    if (sortBy === "name") {
      return sortByName(items);
    } else {
      return sortById(items);
    }
  }, [items, sortBy]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("flex justify-between shadow-0 relative", classNames)}>
          <span className="absolute top-[-8px] font-sm" style={{ fontSize: "12px" }}>
            {label}
          </span>
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
