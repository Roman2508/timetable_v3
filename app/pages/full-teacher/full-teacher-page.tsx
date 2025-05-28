import z from "zod";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Building2, Pencil, Plus, Trash2, User } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { Button } from "~/components/ui/common/button";
import EntityField from "~/components/features/entity-field";
import EntityHeader from "~/components/features/entity-header";
import { onConfirm } from "~/components/features/confirm-modal";
import { RootContainer } from "~/components/layouts/root-container";
import type { TeachersType } from "~/store/teachers/teachers-types";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import { createTeacher, updateTeacher } from "~/store/teachers/teachers-async-actions";
import { createAuditory, deleteAuditory, updateAuditory } from "~/store/auditories/auditories-async-actions";

interface IFullTeacherProps {
  teacherId: string;
  teacher: TeachersType;
}

const initialFormState = {
  name: "",
  seatsNumber: 0,
  courseNumber: "",
  category: "",
  status: "Активний",
};

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }).min(3, { message: "Мінімальна довжина - 3 символа" }),
  seatsNumber: z.number({ message: "Це поле обов'язкове" }),
  category: z.number({ message: "Це поле обов'язкове" }),
  status: z.enum(["Активний", "Архів"], { message: "Це поле обов'язкове" }),
});

export type FormData = z.infer<typeof formSchema>;

const FullTeacher: React.FC<IFullTeacherProps> = ({ teacherId, teacher }) => {
  const isUpdate = !isNaN(Number(teacherId));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { auditoriCategories } = useSelector(auditoriesSelector);

  const generalInformationFields = React.useMemo(
    () => [
      {
        title: "Назва*",
        key: "name",
        text: "Назва/номер аудиторії",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Кількість місць*",
        key: "seatsNumber",
        text: "Кількість посадочних місць в аудиторії",
        isEditable: true,
        inputType: "number",
        variant: "input",
        items: [],
      },
      {
        title: "Статус*",
        key: "status",
        text: "Використовується для відображення або приховування аудиторії",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Активний", name: "Активний" },
          { id: "Архів", name: "Архів" },
        ],
      },
      {
        title: "Категорія",
        key: "category",
        text: "Категорія до якої відноситься аудиторія",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: sortByName(auditoriCategories),
      },
    ],
    [auditoriCategories],
  );

  const [userFormData, setUserFormData] = React.useState<Partial<FormData>>({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [isPending, setIsPanding] = React.useState(false);

  const formData = {
    ...initialFormState,
    ...teacher,
    category: teacher?.category.id,
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
        await dispatch(updateTeacher({ ...formData, id: Number(teacherId) }));
        navigate("/teachers");
        return;
      }

      await dispatch(createTeacher(formData));
      navigate("/teachers");
    } finally {
      setIsPanding(false);
    }
  };

  const onDeleteAuditory = async () => {
    if (!isUpdate) return;

    const title = `Ви впевнені, що хочете видалити викладача: ${getTeacherFullname(teacher)}?`;
    const description = "Викладач, буде видалений назавжди. Цю дію не можна відмінити.";
    const result = await onConfirm({ isOpen: true, title, description }, dispatch);

    if (result) {
      await dispatch(deleteAuditory(Number(teacher)));
      navigate("/teachers");
    }
  };

  return (
    <RootContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          {isUpdate ? (
            <EntityHeader
              Icon={User}
              label="ВИКЛАДАЧ"
              status={teacher.status}
              name={getTeacherFullname(teacher)}
            />
          ) : (
            <h2 className="flex items-center h-14 text-2xl font-semibold">Створити аудиторію</h2>
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
                Створити аудиторію
              </Button>
            )}
          </div>
        </div>

        <Card className="px-10 pb-12 mb-10">
          <h3 className="text-xl font-semibold mb-5">Загальна інформація</h3>
          {generalInformationFields.map((input) => {
            const currentValue = formData[input.key as keyof FormData] as FormData[keyof FormData];

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
      </form>

      {isUpdate && (
        <Card className="px-10 pb-12 mb-6">
          <h3 className="text-xl font-semibold mb-5">Видалення аудиторії</h3>

          <div className="flex flex-col items-start gap-4 mb-4">
            <div>
              <p className="text-black/40 text-md">Аудиторія буде видалена назавжди. Цю дію не можна відмінити.</p>
            </div>

            <Button variant="destructive" onClick={onDeleteAuditory}>
              <Trash2 />
              Видалити аудиторію
            </Button>
          </div>
        </Card>
      )}
    </RootContainer>
  );
};

export default FullTeacher;
