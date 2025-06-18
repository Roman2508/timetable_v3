import { format } from "date-fns";
import { CalendarIcon, ClipboardMinusIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/common/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/common/scroll-area";
import { cn } from "~/lib/utils";

export const DateTimePicker24h = () => {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setDate(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full bg-sidebar justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "HH:mm") : <span>HH:mm</span>}
          {/* {date ? format(date, "MM/dd/yyyy HH:mm") : <span>MM/DD/YYYY HH:mm</span>} */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 origin-[0]" align="start">
        {/* <div className="sm:flex"> */}
        {/* <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus /> */}
        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex sm:flex-col p-2">
              {/* {hours.reverse().map((hour) => ( */}
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
        {/* </div> */}
      </PopoverContent>
    </Popover>
  );
};
const CallScheduleTab = () => {
  return (
    <>
      <>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <ClipboardMinusIcon className="w-5" /> Розклад дзвінків
        </h2>

        <div className="mb-10">
          <p className="text-muted-foreground mb-6">
            Тут ви можете оновити дати початку й завершення навчання — це впливає на доступність дат у редакторі
            розкладу та календарі.
          </p>

          {[...Array(7)].map((_, index) => (
            <div className="flex gap-2 mb-4" key={index}>
              <p className="text-lg font-bold mt-7.5 mr-2">{index + 1}.</p>

              <div className="flex-1">
                <p className="text-sm mb-1">Початок</p>
                <DateTimePicker24h />
              </div>

              <div className="flex-1">
                <p className="text-sm mb-1">Кінець</p>
                <DateTimePicker24h />
              </div>
            </div>
          ))}

          <Button className="mt-4">Зберегти зміни</Button>
        </div>
      </>
    </>
  );
};

export { CallScheduleTab };
