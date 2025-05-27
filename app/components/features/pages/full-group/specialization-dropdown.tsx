import React from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/common/dropdown-menu";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { attachSpecialization } from "~/store/groups/groups-async-actions";

interface ISpecializationDropdownProps {
  groupId: number;
  currentValue: string;
  planSubjectId: number;
  specializationList: string[];
}

const SpecializationDropdown: React.FC<ISpecializationDropdownProps> = ({
  groupId,
  planSubjectId,
  currentValue,
  specializationList,
}) => {
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState(currentValue);
  const [isPending, setIsPending] = React.useState(false);

  const onChangeSpecialization = async (value: string) => {
    try {
      setValue(value);
      setIsPending(true);
      const name = value === "-" ? null : value;
      const payload = { name, groupId: groupId, planSubjectId: planSubjectId };
      dispatch(attachSpecialization(payload));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="p-0">
        <Button
          variant="outline"
          disabled={isPending}
          className={`flex justify-between w-full shadow-0 p-0 h-5 border-0 bg-transparent`}
        >
          <span className="lg:inline">{value}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {["-", "Не вивчається", ...specializationList].map((item) => {
          return (
            <DropdownMenuCheckboxItem
              key={item}
              checked={item === value}
              className="cursor-pointer py-1"
              onCheckedChange={() => onChangeSpecialization(item)}
            >
              {item}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SpecializationDropdown;
