import { useEffect, useState, type FC } from "react";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { customDayjs } from "~/lib/dayjs";
import { Button } from "~/components/ui/common/button";
import { Calendar } from "~/components/ui/common/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";

interface IInputCalendarProps {
  value: string;
  label?: string;
  classNames?: string;
  onValueChange: (date: string) => void;
}

const InputCalendar: FC<IInputCalendarProps> = ({ label = "", value, onValueChange, classNames = "" }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const onSelect = (date: any) => {
    const stringDate = customDayjs(date).format("DD.MM.YYYY");
    onValueChange(stringDate);
    setDate(date);
    setOpen(false);
  };

  const currentYear = Number(new Date().getFullYear());

  useEffect(() => {
    if (!value) return;

    const parsed = customDayjs(value, "DD.MM.YYYY");

    if (parsed.isValid()) {
      const nativeDate = parsed.toDate();
      setDate(nativeDate);
    } else {
      console.error("Некорректная дата");
    }
  }, [value]);

  return (
    <div className={cn("flex flex-col gap-1 mb-2", classNames)}>
      {label && <p className="text-sm">{label}</p>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-sidebar justify-between font-normal">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString() : "Select date"}
            </div>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={onSelect}
            captionLayout="dropdown"
            toYear={currentYear + 5}
            fromYear={currentYear - 5}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { InputCalendar };
