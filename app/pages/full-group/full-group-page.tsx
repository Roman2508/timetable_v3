import z from "zod";
import React from "react";
import { useSelector } from "react-redux";
import { GraduationCap, Package, Pencil, Plus, Trash2 } from "lucide-react";

import { Card } from "~/components/ui/common/card";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import { groupsSelector } from "~/store/groups/groups-slice";
import EntityHeader from "~/components/features/entity-header";
import { RootContainer } from "~/components/layouts/root-container";
import EntitiesDropdown from "~/components/features/entities-dropdown";
import EntityField from "~/components/features/entity-field";

interface IFullGroupProps {
  groupId: string;
}

const initialFormState = {
  name: "",
  yearOfAdmission: "",
  courseNumber: "",
  students: "",
  formOfEducation: "Денна",
  category: "",
  educationPlan: "",
  status: "Активна",
  calendarId: "",
  // name: "",
  // yearOfAdmission: new Date().getFullYear(),
  // courseNumber: 1,
  // students: "",
  // formOfEducation: "Денна",
  // category: 0,
  // educationPlan: 0,
  // status: "Активна",
  // calendarId: "",
};

const formSchema = z.object({
  name: z.string().min(3),
  yearOfAdmission: z.number().min(4).max(4),
  courseNumber: z.number().min(1).max(4),
  students: z.number(),
  formOfEducation: z.string(),
  category: z.number(),
  educationPlan: z.number(),
  status: z.string(),
  calendarId: z.string(),
});

export type GroupFormData = z.infer<typeof formSchema>;

const FullGroup: React.FC<IFullGroupProps> = ({ groupId }) => {
  const isUpdate = !isNaN(Number(groupId));

  const { group } = useSelector(groupsSelector);

  const { plansCategories } = useSelector(plansSelector);
  const { groupCategories } = useSelector(groupsSelector);

  const generalInformationFields = React.useMemo(
    () => [
      {
        title: "Шифр групи*",
        key: "name",
        text: "Унікальний шифр групи",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Рік вступу*",
        key: "yearOfAdmission",
        text: "Рік початку навчання",
        isEditable: true,
        inputType: "number",
        variant: "input",
        items: [],
      },
      {
        title: "Курс*",
        key: "courseNumber",
        text: "Номер поточного курсу навчання",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: [
          { id: "1", name: "1" },
          { id: "2", name: "2" },
          { id: "3", name: "3" },
          { id: "4", name: "4" },
        ],
      },
      {
        title: "Кількість студентів",
        key: "students",
        text: "Загальна кількість студентів у групі",
        isEditable: false,
        inputType: "number",
        variant: "input",
        items: [],
      },
      {
        title: "Форма навчання*",
        key: "formOfEducation",
        text: "Денна або заочна",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Денна", name: "Денна" },
          { id: "Заочна", name: "Заочна" },
        ],
      },
      {
        title: "Статус*",
        key: "status",
        text: "Використовується для відображення або приховування групи",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Активний", name: "Активний" },
          { id: "Архів", name: "Архів" },
        ],
      },
      {
        title: "Структурний підрозділ",
        key: "category",
        text: "Відділення до якого відноситься група",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: groupCategories,
      },
    ],
    [groupCategories],
  );

  const educationLoadFormFields = React.useMemo(
    () => [
      {
        title: "Навчальний план",
        key: "educationPlan",
        text: "Навчальний план, що формує навантаження",
        isEditable: true,
        inputType: "number",
        variant: "button",
        items: plansCategories,
      },
      {
        title: "Потоки",
        key: "stream",
        text: "Об'єднання груп для спільного вивчення дисциплін",
        isEditable: false,
        inputType: "number",
        variant: "button",
        items: [],
      },
      {
        title: "Підгрупи",
        key: "subgroups",
        text: "Розподіл студентів групи для занять за навчальним планом",
        isEditable: false,
        inputType: "number",
        variant: "button",
        items: [],
      },
      {
        title: "Спеціалізовані підгрупи",
        key: "specialities",
        text: "Групи за вибірковими дисциплінами",
        isEditable: false,
        inputType: "number",
        variant: "button",
        items: [],
      },
      {
        title: "Ідентифікатор календаря",
        key: "calendarId",
        text: "Для автоматичного імпорту розкладу занять",
        isEditable: false,
        inputType: "string",
        variant: "input",
        items: [],
      },
    ],
    [plansCategories],
  );

  const [userFormData, setUserFormData] = React.useState<Partial<GroupFormData>>({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [isPending, setIsPanding] = React.useState(false);

  const formData = {
    ...initialFormState,
    ...group,
    ...userFormData,
  };

  const validate = () => {
    const res = formSchema.safeParse(formData);
    if (res.success) return;
    return res.error.format();
  };

  const errors = showErrors ? validate() : undefined;

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsPanding(true);
      const errors = validate();
      if (errors) {
        setShowErrors(true);
        return;
      }
      if (isUpdate) {
        // await dispatch(updateGroup({ ...formData, id: groupId }))
        return;
      }
      // await dispatch(createGroup(formData))
    } finally {
      setIsPanding(false);
    }
  };

  return (
    <RootContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          {isUpdate ? (
            <EntityHeader Icon={GraduationCap} label="ГРУПА" name="PH9-25-1" status="Активна" />
          ) : (
            <h2 className="flex items-center h-14 text-2xl font-semibold">Створити групу</h2>
          )}

          <div className="flex gap-3">
            {isUpdate && (
              <Button variant="outline" type="button">
                <Package />
                Архівувати
              </Button>
            )}

            {isUpdate ? (
              <Button type="submit" disabled={!!errors || isPending}>
                <Pencil />
                Зберегти зміни
              </Button>
            ) : (
              <Button type="submit" disabled={!!errors || isPending}>
                <Plus />
                Створити групу
              </Button>
            )}
          </div>
        </div>

        <Card className="px-10 pb-12 mb-10">
          <h3 className="text-xl font-semibold mb-5">Загальна інформація</h3>
          {generalInformationFields.map((input) => {
            const currentValue = formData[input.key as keyof GroupFormData] as GroupFormData[keyof GroupFormData];
            return (
              <EntityField
                {...input}
                errors={errors}
                inputKey={input.key}
                currentValue={currentValue}
                setUserFormData={setUserFormData}
                variant={input.variant as "input" | "select" | "button"}
              />
            );
          })}
        </Card>

        <Card className="px-10 pb-12 mb-6">
          <h3 className="text-xl font-semibold mb-5">Навантаження групи</h3>
          {educationLoadFormFields.map((input) => {
            const currentValue = formData[input.key as keyof GroupFormData] as GroupFormData[keyof GroupFormData];
            return (
              <EntityField
                {...input}
                errors={errors}
                inputKey={input.key}
                currentValue={currentValue}
                setUserFormData={setUserFormData}
                variant={input.variant as "input" | "select" | "button"}
              />
            );
          })}
        </Card>
      </form>

      {isUpdate && (
        <Card className="px-10 pb-12 mb-6">
          <h3 className="text-xl font-semibold mb-5">Видалення групи</h3>

          <div className="flex flex-col items-start gap-4 mb-4">
            <div>
              <p className="text-black/40 text-md">
                Група, включаючи все навчальне навантаження, розклад та студентів, що зараховані до групи, будуть
                видалені назавжди.
              </p>
              <p className="text-black/40 text-md">Цю дію не можна відмінити.</p>
            </div>

            <Button variant="destructive">
              <Trash2 />
              Видалити групу
            </Button>
          </div>
        </Card>
      )}
    </RootContainer>
  );
};

export default FullGroup;
