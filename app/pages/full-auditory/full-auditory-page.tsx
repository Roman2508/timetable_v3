import z from "zod";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { Button } from "~/components/ui/common/button";
import EntityField from "~/components/features/entity-field";
import EntityHeader from "~/components/features/entity-header";
import { onConfirm } from "~/components/features/confirm-modal";
import { RootContainer } from "~/components/layouts/root-container";
import { auditoriesSelector } from "~/store/auditories/auditories-slise";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";
import { createAuditory, deleteAuditory, updateAuditory } from "~/store/auditories/auditories-async-actions";

interface IFullAuditoryProps {
  auditoryId: string;
  auditory: AuditoriesTypes;
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

const FullAuditory: React.FC<IFullAuditoryProps> = ({ auditoryId, auditory }) => {
  const isUpdate = !isNaN(Number(auditoryId));

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
    ...auditory,
    category: auditory?.category.id,
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
        await dispatch(updateAuditory({ ...formData, id: Number(auditoryId) }));
        navigate("/auditories");
        return;
      }

      await dispatch(createAuditory(formData));
      navigate("/auditories");
    } finally {
      setIsPanding(false);
    }
  };

  const onDeleteAuditory = async () => {
    if (!isUpdate) return;

    const title = `Ви впевнені, що хочете видалити аудиторію: ${auditory.name}?`;
    const description = "Аудиторія, буде видалена назавжди. Цю дію не можна відмінити.";
    const result = await onConfirm({ isOpen: true, title, description }, dispatch);

    if (result) {
      await dispatch(deleteAuditory(Number(auditory)));
      navigate("/auditories");
    }
  };

  return (
    <RootContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          {isUpdate ? (
            <EntityHeader Icon={Building2} label="АУДИТОРІЯ" name={auditory.name} status={auditory.status} />
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

export default FullAuditory;
