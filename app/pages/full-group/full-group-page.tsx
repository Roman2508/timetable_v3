import { GraduationCap, Package, Pencil, Trash2 } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Badge } from "~/components/ui/common/badge";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { RootContainer } from "~/components/layouts/root-container";

const FullGroup = () => {
  return (
    <RootContainer>
      <div className="flex justify-between items-center mb-6">
        <div className="">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 text-black/40" />
            <div className="text-black/40 text-sm">ГРУПА</div>
          </div>

          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-semibold">PH9-25-1</h2>
            <Badge variant="outline" className="text-primary bg-primary-light border-0">
              Активна
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Package />
            Архівувати
          </Button>

          <Button>
            <Pencil />
            Зберегти зміни
          </Button>
        </div>
      </div>

      <Card className="px-10 pb-12 mb-10">
        <h3 className="text-xl font-semibold mb-5">Загальна інформація</h3>

        {[
          { title: "Шифр групи*", text: "Унікальна назва групи" },
          { title: "Рік вступу*", text: "Рік початку навчання" },
          { title: "Курс*", text: "Номер поточного курсу (від 1 до 3)" },
          { title: "Кількість студентів", text: "Загальна кількість студентів у групі" },
          { title: "Форма навчання*", text: "Денна або заочна" },
          { title: "Структурний підрозділ", text: "Відділення до якого відноситься група" },
        ].map((input) => (
          <div className="flex items-start gap-4 mb-4" key={input.title}>
            <div className="min-w-90">
              <h5 className="font-semibold text-md">{input.title}</h5>
              <p className="text-black/40 text-sm">{input.text}</p>
            </div>

            <div className="w-full">
              <Input />
            </div>
          </div>
        ))}
      </Card>

      <Card className="px-10 pb-12 mb-6">
        <h3 className="text-xl font-semibold mb-5">Навантаження групи</h3>

        {[
          { title: "Навчальний план", text: "Навчальний план, що формує навантаження" },
          { title: "Потоки", text: "Об'єднання груп для спільного вивчення дисциплін" },
          { title: "Підгрупи", text: "Розподіл студентів групи для занять за навчальним планом" },
          { title: "Спеціалізовані підгрупи", text: "Групи за вибірковими дисциплінами" },
        ].map((input) => (
          <div className="flex items-start gap-4 mb-4" key={input.title}>
            <div className="min-w-90">
              <h5 className="font-semibold text-md">{input.title}</h5>
              <p className="text-black/40 text-sm">{input.text}</p>
            </div>

            <div className="w-full">
              <Input />
            </div>
          </div>
        ))}
      </Card>

      <Card className="px-10 pb-12 mb-6">
        <h3 className="text-xl font-semibold mb-5">Видалення групи</h3>

        <div className="flex flex-col items-start gap-4 mb-4">
          <div>
            <p className="text-black/40 text-md">
              Група, включаючи все навчальне навантаження, розклад та студентів, що зараховані до групи, будуть видалені
              назавжди.
            </p>
            <p className="text-black/40 text-md">Цю дію не можна відмінити.</p>
          </div>
          {/* Проект, включая все среды и услуги, будет навсегда удален. Это действие не может быть отменено.*/}

          <Button variant="destructive">
            <Trash2 />
            Видалити групу
          </Button>
        </div>
      </Card>
    </RootContainer>
  );
};

export default FullGroup;
