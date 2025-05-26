import z from "zod";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { Button } from "~/components/ui/common/button";
import { plansSelector } from "~/store/plans/plans-slice";
import EntityField from "~/components/features/entity-field";
import type { GroupsType } from "~/store/groups/groups-types";
import EntityHeader from "~/components/features/entity-header";
import { onConfirm } from "~/components/features/confirm-modal";
import { RootContainer } from "~/components/layouts/root-container";
import { groupsSelector, setGroup } from "~/store/groups/groups-slice";
import SelectPlanModal from "~/components/features/select-plan/select-plan-modal";
import SubgroupsModal from "~/components/features/pages/full-group/subgroups-modal";
import { createGroup, deleteGroup, updateGroup } from "~/store/groups/groups-async-actions";
import SpecializationModal from "~/components/features/pages/full-group/specialization-modal";

interface IFullGroupProps {
  groupId: string;
  group: GroupsType;
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
};

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }).min(3, { message: "Мінімальна довжина - 3 символа" }),
  yearOfAdmission: z.number().refine((num) => num.toString().length === 4, {
    message: "Не вірно вказано рік початку навчання",
  }),
  courseNumber: z.number({ message: "Це поле обов'язкове" }).min(1).max(4),
  students: z.number().optional(),
  formOfEducation: z.enum(["Денна", "Заочна"], { message: "Це поле обов'язкове" }),
  category: z.number({ message: "Це поле обов'язкове" }),
  educationPlan: z.number({ message: "Це поле обов'язкове" }),
  status: z.enum(["Активний", "Архів"], { message: "Це поле обов'язкове" }),
  calendarId: z.string().optional(),
});

export type GroupFormData = z.infer<typeof formSchema>;

const FullGroup: React.FC<IFullGroupProps> = ({ groupId, group }) => {
  const isUpdate = !isNaN(Number(groupId));

  const dispatch = useAppDispatch();

  const {
    group: { groupLoad },
  } = useSelector(groupsSelector);

  const navigate = useNavigate();

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

  const [openedModalName, setOpenedModalName] = React.useState("plan");

  const [userFormData, setUserFormData] = React.useState<Partial<GroupFormData>>({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [isPending, setIsPanding] = React.useState(false);

  const formData = {
    ...initialFormState,
    ...group,
    students: group?.students.length || 0,
    ...userFormData,
  };

  const validate = () => {
    const res = formSchema.safeParse(formData);
    if (res.success) return;
    return res.error.format();
  };

  const errors = showErrors ? validate() : undefined;

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    const excludedKeys = ["groupLoad", "isHide", "specializationList", "stream", "id"];
    // Виключаю зайві ключі з об'єкта нової групи
    const groupData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => !excludedKeys.includes(key)),
    ) as GroupFormData;

    try {
      e.preventDefault();
      setIsPanding(true);
      const errors = validate();
      if (errors) {
        setShowErrors(true);
        return;
      }

      if (isUpdate) {
        await dispatch(updateGroup({ ...groupData, id: Number(groupId) }));
        return;
      }

      await dispatch(createGroup(groupData));
      navigate("/groups");
    } finally {
      setIsPanding(false);
    }
  };

  const onDeleteGroup = async () => {
    if (!isUpdate) return;

    const title = `Ви впевнені, що хочете видалити групу: ${group.name}?`;
    const description =
      "Група, включаючи все навчальне навантаження, розклад та студентів, що зараховані до групи, будуть видалені назавжди. Цю дію не можна відмінити.";

    const result = await onConfirm({ isOpen: true, title, description }, dispatch);

    if (result) {
      await dispatch(deleteGroup(Number(groupId)));
      navigate("/groups");
    }
  };

  React.useEffect(() => {
    if (!group) return;
    dispatch(setGroup(group));
  }, [groupId]);

  // const groupLoad = [
  //   {
  //     id: 5,
  //     name: "Фармакологія",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ЕКЗ",
  //     typeEn: "exams",
  //     hours: 2,
  //     subgroupNumber: null,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 1 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  //   {
  //     id: 1,
  //     name: "Ділова іноземна мова (B2)",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ЛК",
  //     typeEn: "lectures",
  //     hours: 24,
  //     subgroupNumber: null,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 2 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  //   {
  //     id: 2,
  //     name: "Ділова іноземна мова (B2)",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ПЗ",
  //     typeEn: "practical",
  //     hours: 36,
  //     subgroupNumber: null,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 2 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  //   {
  //     id: 3,
  //     name: "Фармакологія",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ЛК",
  //     typeEn: "lectures",
  //     hours: 10,
  //     subgroupNumber: null,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 1 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  //   {
  //     id: 4,
  //     name: "Фармакологія",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ПЗ",
  //     typeEn: "practical",
  //     hours: 30,
  //     subgroupNumber: 1,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 1 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  //   {
  //     id: 14,
  //     name: "Фармакологія",
  //     semester: 1,
  //     specialization: null,
  //     typeRu: "ПЗ",
  //     typeEn: "practical",
  //     hours: 30,
  //     subgroupNumber: 2,
  //     group: { id: 1, name: "PH9-25-1" },
  //     planSubjectId: { id: 1 },
  //     plan: { id: 1 },
  //     stream: null,
  //     cmk: { id: 1 },
  //     teacher: null,
  //   },
  // ];

  return (
    <>
      <SelectPlanModal
        setUserFormData={setUserFormData}
        setOpenedModalName={setOpenedModalName}
        isOpen={openedModalName === "educationPlan"}
      />

      <SubgroupsModal
        setOpenedModalName={setOpenedModalName}
        isOpen={openedModalName === "subgroups"}
      />

      <SpecializationModal
        groupId={groupId}
        setOpenedModalName={setOpenedModalName}
        isOpen={openedModalName === "specialities"}
        specializationList={group.specializationList}
      />

      <RootContainer>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            {isUpdate ? (
              <EntityHeader Icon={GraduationCap} label="ГРУПА" name={group.name} status={group.status} />
            ) : (
              <h2 className="flex items-center h-14 text-2xl font-semibold">Створити групу</h2>
            )}

            <div className="flex gap-3">
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
                  isUpdate={isUpdate}
                  inputKey={input.key}
                  currentValue={currentValue}
                  setUserFormData={setUserFormData}
                  inputType={input.inputType as "string" | "number"}
                  variant={input.variant as "input" | "select" | "button"}
                />
              );
            })}
          </Card>

          <Card className="px-10 pb-12 mb-10">
            <h3 className="text-xl font-semibold mb-5">Навантаження групи</h3>
            {educationLoadFormFields.map((input) => {
              const currentValue = formData[input.key as keyof GroupFormData] as GroupFormData[keyof GroupFormData];
              return (
                <EntityField
                  {...input}
                  errors={errors}
                  isUpdate={isUpdate}
                  inputKey={input.key}
                  currentValue={currentValue}
                  setUserFormData={setUserFormData}
                  setOpenedModalName={setOpenedModalName}
                  inputType={input.inputType as "string" | "number"}
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

              <Button variant="destructive" onClick={onDeleteGroup}>
                <Trash2 />
                Видалити групу
              </Button>
            </div>
          </Card>
        )}
      </RootContainer>
    </>
  );
};

export default FullGroup;
