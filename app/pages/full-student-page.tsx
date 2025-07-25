import z from "zod";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Pencil, Plus, Trash2, User } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Card } from "~/components/ui/common/card";
import { sortByName } from "~/helpers/sort-by-name";
import { dialogText } from "~/constants/dialogs-text";
import { Button } from "~/components/ui/common/button";
import { groupsSelector } from "~/store/groups/groups-slice";
import EntityField from "~/components/features/entity-field";
import EntityHeader from "~/components/features/entity-header";
import type { StudentType } from "~/store/students/students-types";
import { RootContainer } from "~/components/layouts/root-container";
import { ConfirmWindow } from "~/components/features/confirm-window";
import { createStudent, deleteStudent, updateStudent } from "~/store/students/students-async-actions";

interface IFullStudentProps {
  studentId: string;
  student: StudentType;
}

const initialFormState = {
  name: "",
  login: "",
  email: "",
  password: "",
  group: "",
  status: "Навчається",
};

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }),
  login: z.string({ message: "Це поле обов'язкове" }),
  email: z.string({ message: "Це поле обов'язкове" }).email({ message: "Не вірний формат пошти" }),
  password: z.string().optional(),
  group: z.number({ message: "Це поле обов'язкове" }),
  status: z.enum(["Навчається", "Академічна відпустка", "Відраховано"], { message: "Це поле обов'язкове" }),
});

export type FormData = z.infer<typeof formSchema>;

const FullStudent: React.FC<IFullStudentProps> = ({ studentId, student }) => {
  const isUpdate = !isNaN(Number(studentId));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { groupCategories } = useSelector(groupsSelector);

  const generalInformationFields = React.useMemo(
    () => [
      {
        title: "ПІБ*",
        key: "name",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Логін*",
        key: "login",
        text: "Для відображення у розкладі та списках",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Пошта*",
        key: "email",
        text: "Використовується для доступу до системи",
        isEditable: true,
        inputType: "email",
        variant: "input",
        items: [],
      },
      {
        title: "Пароль*",
        key: "password",
        text: "Використовується для доступу до системи",
        isEditable: true,
        inputType: "string",
        variant: "input",
        items: [],
      },
      {
        title: "Статус*",
        key: "status",
        text: "Використовується для відображення або приховування викладача",
        isEditable: true,
        inputType: "string",
        variant: "select",
        items: [
          { id: "Навчається", name: "Навчається" },
          { id: "Академічна відпустка", name: "Академічна відпустка" },
          { id: "Відраховано", name: "Відраховано" },
        ],
      },
      {
        title: "Група*",
        key: "group",
        text: "Група до якої відноситься студент",
        isEditable: true,
        inputType: "number",
        variant: "select",
        items: sortByName(groupCategories?.flatMap((el) => el.groups)),
      },
    ],
    [groupCategories],
  );

  const [userFormData, setUserFormData] = React.useState<Partial<FormData>>({});
  const [showErrors, setShowErrors] = React.useState(false);
  const [isPending, setIsPanding] = React.useState(false);

  const formData = {
    ...initialFormState,
    ...student,
    group: student?.group.id,
    ...userFormData,
  };

  const conditionalFormSchema = formSchema.superRefine((data, ctx) => {
    if (!isUpdate && !data.password) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Це поле обов'язкове",
      });
    }
  });

  const validate = () => {
    const res = conditionalFormSchema.safeParse(formData);
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
        await dispatch(updateStudent({ ...formData, id: student.id }));
        navigate("/students");
        return;
      }

      await dispatch(createStudent(formData));
      navigate("/students");
    } finally {
      setIsPanding(false);
    }
  };

  const onDeleteStudent = async () => {
    if (!isUpdate) return;
    const confirmed = await ConfirmWindow(dialogText.confirm.students.title, dialogText.confirm.students.text);
    if (confirmed) {
      await dispatch(deleteStudent(Number(student.id)));
      navigate("/students");
    }
  };

  return (
    <RootContainer>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          {isUpdate ? (
            <EntityHeader Icon={User} label="СТУДЕНТ" status={student.status} name={student.name} />
          ) : (
            <h2 className="flex items-center h-14 text-2xl font-semibold">Створити студента</h2>
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
                Створити студента
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
                // @ts-ignore
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
          <h3 className="text-xl font-semibold mb-5">Видалення студента</h3>

          <div className="flex flex-col items-start gap-4 mb-4">
            <div>
              <p className="text-black/40 text-md">
                Студент та всі результати навчання пов'язані з ним будуть видалені назавжди.
              </p>
              <p className="text-black/40 text-md">Цю дію не можна відмінити.</p>
            </div>

            <Button variant="destructive" onClick={onDeleteStudent}>
              <Trash2 />
              Видалити студента
            </Button>
          </div>
        </Card>
      )}
    </RootContainer>
  );
};

export default FullStudent;
