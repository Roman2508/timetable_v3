import { useEffect, useState, type FC } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "../common/button";
import { ScrollArea, ScrollBar } from "../common/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../common/popover";
import { customDayjs } from "~/lib/dayjs";

interface IInputTimeProps {
  value: string;
  classNames?: string;
  onValueChange: (date: string) => void;
}

export const InputTime: FC<IInputTimeProps> = ({ classNames, value, onValueChange }) => {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    const base = date ?? new Date();
    const newDate = new Date(base.getTime());

    if (type === "hour") newDate.setHours(parseInt(newValue));
    if (type === "minute") newDate.setMinutes(parseInt(newValue));

    setDate(newDate);
    const strDate = customDayjs(newDate).format("HH:mm");
    onValueChange(strDate);
  };

  useEffect(() => {
    if (!value) return;
    const parsed = customDayjs(value, "HH:mm");
    if (parsed.isValid()) {
      const nativeDate = parsed.toDate();
      setDate(nativeDate);
    } else {
      console.error("Некорректная дата");
    }
  }, [value]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full bg-sidebar justify-start text-left font-normal",
            !date && "text-muted-foreground",
            classNames,
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "HH:mm") : <span>HH:mm</span>}
          {/* {date ? format(date, "MM/dd/yyyy HH:mm") : <span>MM/DD/YYYY HH:mm</span>} */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 origin-[0]" align="start">
        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={date && date.getHours() === hour ? "default" : "ghost"}
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("hour", hour.toString())}
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>

          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                  className="sm:w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("minute", minute.toString())}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
