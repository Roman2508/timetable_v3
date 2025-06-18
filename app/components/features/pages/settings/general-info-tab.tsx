import { InfoIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Input } from "~/components/ui/common/input";

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

export { GeneralInfoTab };
