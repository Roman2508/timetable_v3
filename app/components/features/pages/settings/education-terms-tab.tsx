import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/common/button";
import { InputCalendar } from "~/components/ui/custom/input-calendar";

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
        <InputCalendar label="Початок" />
        <InputCalendar label="Кінець" />

        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 mt-10">Друге півріччя</h2>
        <InputCalendar label="Початок" />
        <InputCalendar label="Кінець" />

        <Button className="mt-8">Зберегти зміни</Button>
      </div>
    </>
  );
};

export { EducationTermsTab };
