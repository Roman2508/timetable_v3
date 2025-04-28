import React from "react";
import {
  Apple,
  Calendar,
  Camera,
  ChevronRight,
  Chrome,
  KeyRound,
  Lock,
  Mail,
  MonitorSmartphone,
  NotebookPen,
  Palette,
  Plus,
  Settings,
  SwatchBook,
  User,
} from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { InputSearch } from "~/components/ui/custom/input-search";
import { RootContainer } from "~/components/layouts/root-container";
import { PopoverFilter } from "~/components/ui/custom/popover-filter";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/common/tabs";
import { TeacherCard } from "~/components/features/pages/teachers/teacher-card";
import { TeachersList } from "~/components/features/pages/teachers/teachers-list";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/common/input";
import { InputPassword } from "~/components/ui/custom/input-password";

const tabsList = [
  { icon: <User />, label: "Профіль", value: "profile" },
  { icon: <Lock />, label: "Пароль та безпека", value: "security" },
  { icon: <Palette />, label: "Персоналізація", value: "personalization" },
  { icon: <Lock />, label: "Електронний журнал", value: "grade-book" },
  { icon: <Lock />, label: "Розклад", value: "timetable" },
];

const sessions = [
  {
    userId: "1",
    createdAt: "20.04.2025 - 12:44:38",
    metadata: {
      ip: "173.166.164.121",
      location: {
        country: "United States of America",
        city: "Washington",
        latitude: 0,
        longtitude: 0,
      },
      device: {
        browser: "Safari",
        os: "Apple",
        type: "-",
      },
    },
  },
  {
    userId: "2",
    createdAt: "20.04.2025 - 12:44:38",
    metadata: {
      ip: "173.166.164.121",
      location: {
        country: "Ukraine",
        city: "Zhytomyr",
        latitude: 0,
        longtitude: 0,
      },
      device: {
        browser: "Chrome",
        os: "Windows",
        type: "",
      },
    },
  },
];

const ProfileTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <User className="w-5" /> Профіль
      </h2>

      <div className="flex justify-center mb-10">
        <div className="w-35 h-35 rounded-full hover:bg-secondary bg-secondary/50 flex flex-col justify-center items-center border-2 border-dashed cursor-pointer">
          <Camera className="relative top-[-5px]" />
          <p className="relative top-[-5px] text-xs text-center">Завантажити фото</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <NotebookPen className="w-5" /> Особиста інформація
        </h2>

        <p className="text-muted-foreground mb-6">
          Відредагуйте своє ім'я тут, якщо хочете внести будь-які зміни. Ви також можете редагувати своє ім'я
          користувача, яке буде відображатися публічно.
        </p>

        <p className="text-sm">Прізвище</p>
        <Input className="mt-1 mb-2" />
        <p className="text-sm">Ім'я</p>
        <Input className="mt-1 mb-2" />
        <p className="text-sm">По-батькові</p>
        <Input className="mt-1" />

        <h2 className="text-2xl mt-10 text-error">TODO:</h2>
        <p className="text-xl text-error">Дописати інформації про вчені звання, категорії, посаду і т.д.</p>
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <Mail className="w-5" /> Електронна пошта
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається ваша адреса електронної пошти. Ви можете використовувати її для входу до вашого облікового
          запису.
        </p>

        <p className="text-sm">Пошта</p>
        <Input className="mt-1" value="ptashnyk.roman@pharm.zt.ua" readOnly />
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <Calendar className="w-5" /> Google календар
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається ваш особистий ідентифікатор календаря або календаря вашої групи (для студентів). Ви можете
          використовувати його для перегляду свого розкладу.
        </p>

        <p className="text-sm">Ідентифікатор календаря</p>
        <Input className="mt-1" value="c_bm889j2bs1deaqqn05tuan5tn8@group.calendar.google.com" readOnly />
      </div>
    </>
  );
};

const SecurityTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <Lock className="w-5" /> Пароль та безпека
      </h2>

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <KeyRound className="w-5" /> Пароль
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>

        <p className="text-sm">Пароль</p>
        <InputPassword wrapperClassName="mt-1" value="sadasdasdads" readOnly />
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <MonitorSmartphone className="w-5" /> Активні пристрої та сесії
        </h2>

        <p className="text-muted-foreground mb-6">Перегляньте список пристроїв, на яких ви авторизовані</p>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Поточна</h4>
          {[sessions[1]].map((el) => {
            const { device, location } = el.metadata;
            return (
              <div className="flex gap-4 bg-secondary p-4 cursor-pointer border">
                <div className="">
                  {el.metadata.device.browser === "Safari" && <Apple size={48} strokeWidth={1} />}
                  {el.metadata.device.browser === "Chrome" && <Chrome size={48} strokeWidth={1} />}
                </div>
                <div className="flex-1">
                  <h5 className="text-md font-semibold">
                    {device.os}, {device.browser}
                  </h5>
                  <p className="text-sm">
                    {location.country}, {location.city}
                  </p>

                  <p className="mt-4 text-sm">{el.createdAt}</p>
                </div>

                <ChevronRight />
              </div>
            );
          })}

          <h4 className="text-lg font-semibold mt-4">Інші</h4>
          {sessions.map((el) => {
            const { device, location } = el.metadata;
            return (
              <div className="flex gap-4 bg-secondary p-4 cursor-pointer border">
                <div className="">
                  {el.metadata.device.browser === "Safari" && <Apple size={48} strokeWidth={1} />}
                  {el.metadata.device.browser === "Chrome" && <Chrome size={48} strokeWidth={1} />}
                </div>
                <div className="flex-1">
                  <h5 className="text-md font-semibold">
                    {device.os}, {device.browser}
                  </h5>
                  <p className="text-sm">
                    {location.country}, {location.city}
                  </p>

                  <p className="mt-4 text-sm">{el.createdAt}</p>
                </div>

                <ChevronRight />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const PersonalizationTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <Palette className="w-5" /> Персоналізація
      </h2>

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <SwatchBook className="w-5" /> Кольоровий фільтр
        </h2>

        <p className="text-muted-foreground mb-6">
          Налаштуйте кольорові фільтри відповідно до особистих вподобань, роблячи ваш досвід більш доступним і
          комфортним.
        </p>

        <p className="text-sm mb-1">Базовий колір</p>

        <div className="flex gap-2">
          {["primary", "error", "success", "secondary", "primary", "error", "success", "secondary"].map((el, index) => {
            const color =
              el === "primary"
                ? "#8a05ff"
                : el === "error"
                ? "#af1d27"
                : el === "success"
                ? "#006d4c"
                : "rgb(198 251 157)";
            return (
              <div className={cn(index == 0 ? `border border-1 border-black` : "cursor-pointer")}>
                <div
                  className={cn(`w-10 h-10 bg-${el}`, index == 0 ? `border border-3 border-white` : "")}
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      <hr />

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <Calendar className="w-5" /> Розклад занять
        </h2>

        <p className="text-muted-foreground mb-6">
          Налаштуйте кольорові фільтри відповідно до особистих вподобань, роблячи ваш досвід більш доступним і
          комфортним.
        </p>

        {["Лекції", "Практичні", "Лабораторні", "Семінари", "Екзамени", "Консультація до екзамену"].map((el) => (
          <div key={el} className="mb-2">
            <p className="text-sm">{el}</p>
            <div className="flex gap-2 items-center mt-1">
              <Input value="#83241f" />
              <div className="w-10 h-10 bg-primary"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = React.useState(tabsList[0].value);

  return (
    <RootContainer classNames="mb-10 flex gap-8">
      <div className="w-70">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <Settings className="w-5" /> Налаштування
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
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "personalization" && <PersonalizationTab />}
      </div>
    </RootContainer>
  );
};

export default ProfilePage;
