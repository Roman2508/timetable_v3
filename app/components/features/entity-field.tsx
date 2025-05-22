import React from "react";
import { Maximize2 } from "lucide-react";
import type { ZodFormattedError } from "zod";

import { cn } from "~/lib/utils";
import { Input } from "../ui/common/input";
import { Button } from "../ui/common/button";
import EntitiesDropdown from "./entities-dropdown";
import type { GroupFormData } from "~/pages/full-group/full-group-page";

type ItemType = {
  id: number | string;
  name: string;
  [key: string]: any;
};

interface IEntityFieldProps {
  text: string;
  title: string;
  inputKey: string;
  isEditable: boolean;
  items: ItemType[] | null;
  variant: "input" | "select" | "button";
  errors?: ZodFormattedError<GroupFormData>;
  currentValue: GroupFormData[keyof GroupFormData];
  setUserFormData: React.Dispatch<React.SetStateAction<Partial<GroupFormData>>>;
}

const EntityField: React.FC<IEntityFieldProps> = ({
  text,
  items,
  title,
  errors,
  variant,
  inputKey,
  isEditable,
  currentValue,
  setUserFormData,
}) => {
  if (variant === "input") {
    return (
      <div className="flex items-start gap-4 mb-4" key={title}>
        <div className="min-w-90">
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <Input
            value={currentValue}
            readOnly={!isEditable}
            className={cn("hover:bg-accent", !isEditable ? "cursor-default" : "")}
            onChange={(e) => setUserFormData((prev) => ({ ...prev, [inputKey]: e.target.value }))}
          />
          <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
        </div>
      </div>
    );
  }

  if (variant === "select") {
    const activeItem = items
      ? items.find((el) => String(el.id) === String(currentValue))
      : items
      ? items[0]
      : { name: "", id: "" };

    return (
      <div className="flex items-start gap-4 mb-4">
        <div className="min-w-90">
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <EntitiesDropdown
            activeItem={activeItem}
            items={items ? items : []}
            onChangeSelected={(value) => setUserFormData((prev) => ({ ...prev, [inputKey]: value }))}
          />
          <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
        </div>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className="flex items-start gap-4 mb-4" key={title}>
        <div className="min-w-90">
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <Button className="w-full border !justify-between px-3 bg-sidebar" variant="secondary" type="button">
            Редагувати
            <Maximize2 />
          </Button>
          <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
        </div>
      </div>
    );
  }
};

export default EntityField;
