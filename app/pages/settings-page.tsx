import {
  ChevronDownIcon,
  Info as InfoIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  ClipboardMinus as ClipboardMinusIcon,
} from "lucide-react";
import { format } from "date-fns";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Calendar } from "~/components/ui/common/calendar";
import { RootContainer } from "~/components/layouts/root-container";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { ScrollArea, ScrollBar } from "~/components/ui/common/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";

const tabsList = [
  { icon: <InfoIcon />, label: "Загальна інформація", value: "general-info" },
  { icon: <CalendarIcon />, label: "Терміни навчання", value: "education-terms" },
  { icon: <ClipboardMinusIcon />, label: "Розклад дзвінків", value: "call-schedule" },
  { icon: <UsersIcon />, label: "Облікові записи", value: "accounts" },
  { icon: <InfoIcon />, label: "Ролі", value: "roles" },
];

const GeneralInfoTab = () => {
  const fields = [
    "Назва організації",
    "Керівник організації",
    "Заступник з навчальної роботи (ПІБ)",
    "Головний бухгалтер",
    "Логотип сайту (URL)",
    "Міністерство (для шапки відомостей)",
    "Ідентифікаційний код організації",
    "Індекс населеного пункту організації",
    "Область місця розташування організації",
    "Населений пункт місця розташування організації",
    "Вулиця місця розташування організації",
  ];

  const fields2 = ["Google API Client id", "Google API Client secret", "Google API Root email"];

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <InfoIcon className="w-5" /> Загальна інформація
      </h2>

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Загальна інформація
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>

        {fields.map((label) => (
          <div className="mb-4">
            <p className="text-sm mb-1">{label}</p>
            <Input value="" readOnly />
          </div>
        ))}
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <FaGoogle className="w-5" /> Google API
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>

        {fields2.map((label) => (
          <div className="mb-4">
            <p className="text-sm mb-1">{label}</p>
            <Input value="" readOnly />
          </div>
        ))}
      </div>
    </>
  );
};

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
          та календарі.
        </p>

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">Перше півріччя</h2>
        <CalendarInput label="Початок" />
        <CalendarInput label="Кінець" />

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 mt-10">Друге півріччя</h2>
        <CalendarInput label="Початок" />
        <CalendarInput label="Кінець" />

        <Button className="mt-4">Зберегти зміни</Button>
      </div>
    </>
  );
};

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

const AccountsTab = () => {
  return (
    <>
      <div className="">AccountsTab</div>
    </>
  );
};

const RolesTab = () => {
  return (
    <>
      <div>RolesTab</div>
    </>
  );
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = React.useState(tabsList[0].value);

  return (
    <RootContainer classNames="mb-10 flex gap-8">
      <div className="w-70">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5" /> Налаштування
        </h2>

        <div className="sticky top-10">
          <Tabs defaultValue={activeTab} className="mb-4" orientation="vertical">
            <TabsList className="flex gap-2 flex-col w-full h-full">
              {tabsList.map((el) => (
                <TabsTrigger
                  key={el.value}
                  value={el.value}
                  onClick={() => setActiveTab(el.value)}
                  className="w-full py-3 flex justify-start border data-[state=active]:border-primary bg-secondary"
                >
                  {el.icon} {el.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-[800px] w-full mx-auto">
        {activeTab === "general-info" && <GeneralInfoTab />}
        {activeTab === "education-terms" && <EducationTermsTab />}
        {activeTab === "call-schedule" && <CallScheduleTab />}
        {activeTab === "accounts" && <AccountsTab />}
        {activeTab === "roles" && <RolesTab />}
      </div>
    </RootContainer>
  );
};

export default SettingsPage;
