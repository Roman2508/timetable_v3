import { useState } from "react";
import { ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/common/button";
import { Calendar } from "~/components/ui/common/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";

const CalendarInput = ({ label }: { label: string }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  const onSelect = (date: any) => {
    setDate(date);
    setOpen(false);
  };

  const currentYear = Number(new Date().getFullYear());

  return (
    <div className="flex flex-col gap-1 mb-2">
      <p className="text-sm">{label}</p>

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
            captionLayout="dropdown"
            onSelect={onSelect}
            fromYear={currentYear - 5}
            toYear={currentYear + 5}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const EducationTermsTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <CalendarIcon className="w-5" /> Терміни навчання
      </h2>

      <div className="mb-10">
        <p className="text-muted-foreground mb-6">
          Тут ви можете оновити дати початку й завершення навчання — це впливає на доступність дат у редакторі розкладу
          та календарі. Терміни навчання потрібно вказувати на початку кожного навчального року
        </p>

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">Перше півріччя</h2>
        <CalendarInput label="Початок" />
        <CalendarInput label="Кінець" />

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 mt-10">Друге півріччя</h2>
        <CalendarInput label="Початок" />
        <CalendarInput label="Кінець" />

        <Button className="mt-8">Зберегти зміни</Button>
      </div>
    </>
  );
};

export { EducationTermsTab };
