import React from "react"
import { Maximize2 } from "lucide-react"
import type { ZodFormattedError } from "zod"

import { cn } from "~/lib/utils"
import { Input } from "../ui/common/input"
import { Button } from "../ui/common/button"
import EntitiesDropdown from "./entities-dropdown"
import { MultiSelect } from "../ui/custom/multi-select"
import type { GroupFormData } from "~/pages/full-group-page"

type ItemType = {
  id: number | string
  name: string
  [key: string]: any
}

interface IEntityFieldProps {
  text: string
  title: string
  inputKey: string
  isUpdate: boolean
  classNames?: string
  isEditable: boolean
  labelClassNames?: string
  items: ItemType[] | null
  inputType: "string" | "number"
  onChange?: (...args: any[]) => void
  variant: "input" | "select" | "multi-select" | "button"
  errors?: ZodFormattedError<GroupFormData>
  currentValue: string | string[] | number | undefined
  // currentValue: GroupFormData[keyof GroupFormData];
  setOpenedModalName?: React.Dispatch<React.SetStateAction<string>>
  setUserFormData: React.Dispatch<React.SetStateAction<Partial<any>>>
  // setUserFormData: React.Dispatch<React.SetStateAction<Partial<GroupFormData>>>;
}

const EntityField: React.FC<IEntityFieldProps> = ({
  text,
  items,
  title,
  errors,
  variant,
  inputKey,
  isUpdate,
  onChange,
  inputType,
  isEditable,
  classNames,
  currentValue,
  setUserFormData,
  labelClassNames,
  setOpenedModalName,
}) => {
  const disabledWhenCreateKeys = ["students", "stream", "subgroups", "specialities", "calendarId"]
  const isDisabled = !isUpdate && disabledWhenCreateKeys.includes(inputKey)

  if (variant === "input") {
    return (
      <div className={cn("flex items-start gap-4 mb-4", classNames)} key={title}>
        <div className={cn("min-w-90", labelClassNames)}>
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <Input
            type={inputType}
            value={currentValue}
            disabled={isDisabled}
            readOnly={!isEditable}
            className={cn("hover:bg-accent", !isEditable ? "cursor-default" : "")}
            onChange={(e) => {
              const value = inputType === "number" ? Number(e.target.value) : e.target.value
              setUserFormData((prev) => ({ ...prev, [inputKey]: value }))
            }}
          />
          {/* <p className="text-error text-sm mt-1">{errors?.[inputKey as keyof typeof errors]?._errors.join(", ")}</p> */}
          <p className="text-error text-sm mt-1">
            {typeof errors?.[inputKey as keyof typeof errors] === "object" &&
              "_errors" in (errors[inputKey as keyof typeof errors] ?? {}) &&
              (errors[inputKey as keyof typeof errors] as { _errors: string[] })._errors.join(", ")}
          </p>
        </div>
      </div>
    )
  }

  if (variant === "select") {
    const activeItem = items
      ? items.find((el) => String(el.id) === String(currentValue))
      : items
      ? items[0]
      : { name: "", id: "" }

    return (
      <div className={cn("flex items-start gap-4 mb-4", classNames)}>
        <div className={cn("min-w-90", labelClassNames)}>
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <EntitiesDropdown
            activeItem={activeItem}
            items={items ? items : []}
            onChangeSelected={(value) =>
              setUserFormData((prev) => {
                const currentValue = inputKey === "status" || inputKey === "status" ? value : Number(value)
                return { ...prev, [inputKey]: currentValue }
              })
            }
          />
          <p className="text-error text-sm mt-1">
            {typeof errors?.[inputKey as keyof typeof errors] === "object" &&
              "_errors" in (errors[inputKey as keyof typeof errors] ?? {}) &&
              (errors[inputKey as keyof typeof errors] as { _errors: string[] })._errors.join(", ")}
          </p>
        </div>
      </div>
    )
  }

  if (variant === "multi-select") {
    return (
      <div className={cn("flex items-start gap-4 mb-4", classNames)}>
        <div className={cn("min-w-90", labelClassNames)}>
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <MultiSelect
            onChange={onChange}
            activeItems={currentValue as any[]}
            items={items ? items : []}
            onChangeSelected={(newItem) => {
              setUserFormData((prev) => {
                const currentPrev = typeof prev[inputKey] === "undefined" ? { ...prev, [inputKey]: [] } : prev
                return { ...currentPrev, [inputKey]: newItem }
              })
            }}
          />
          <p className="text-error text-sm mt-1">
            {typeof errors?.[inputKey as keyof typeof errors] === "object" &&
              "_errors" in (errors[inputKey as keyof typeof errors] ?? {}) &&
              (errors[inputKey as keyof typeof errors] as { _errors: string[] })._errors.join(", ")}
          </p>
        </div>
      </div>
    )
  }

  if (variant === "button") {
    const selectedPlan =
      inputKey === "educationPlan"
        ? (items ? items.flatMap((el) => el.plans) : [])?.find((el) => el.id === Number(currentValue))
        : null
    const buttonText = inputKey === "educationPlan" ? (selectedPlan ? selectedPlan.name : "Редагувати") : "Редагувати"

    return (
      <div className={cn("flex items-start gap-4 mb-4", classNames)} key={title}>
        <div className={cn("min-w-90", labelClassNames)}>
          <h5 className="font-semibold text-md">{title}</h5>
          <p className="text-black/40 text-sm">{text}</p>
        </div>

        <div className="w-full">
          <Button
            type="button"
            variant="secondary"
            disabled={isDisabled}
            className="w-full border !justify-between px-3 bg-sidebar"
            onClick={() => setOpenedModalName && setOpenedModalName(inputKey)}
          >
            {buttonText}
            <Maximize2 />
          </Button>
          <p className="text-error text-sm mt-1">
            {typeof errors?.[inputKey as keyof typeof errors] === "object" &&
              "_errors" in (errors[inputKey as keyof typeof errors] ?? {}) &&
              (errors[inputKey as keyof typeof errors] as { _errors: string[] })._errors.join(", ")}
          </p>
        </div>
      </div>
    )
  }
}

export default EntityField
