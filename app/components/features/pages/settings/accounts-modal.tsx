import { z } from "zod";
import { useSelector } from "react-redux";
import { useMemo, useRef, useState, type Dispatch, type FC, type MouseEvent, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import EntityField from "../../entity-field";
import { useAppDispatch } from "~/store/store";
import { sortByName } from "~/helpers/sort-by-name";
import { Button } from "~/components/ui/common/button";
import type { UserType } from "~/store/auth/auth-types";
import { rolesSelector } from "~/store/roles/roles-slice";
import { Separator } from "~/components/ui/common/separator";

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }),
  email: z.string({ message: "Це поле обов'язкове" }),
  password: z.string({ message: "Це поле обов'язкове" }).optional(),
  roles: z.array(z.string()).min(1, "Оберіть хоча б один варіант"),
});

export type FormData = z.infer<typeof formSchema>;

interface Props {
  isOpen: boolean;
  user: UserType | null;
  modalType: "create" | "update";
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setModalType: Dispatch<SetStateAction<"create" | "update">>;
}

const AccountsModal: FC<Props> = ({ user, isOpen, setIsOpen, modalType, setModalType }) => {
  const dispatch = useAppDispatch();

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const { roles } = useSelector(rolesSelector);

  const formFields = useMemo(
    () => [
      {
        title: "Дисципліна*",
        key: "name",
        text: "Назва дисципліни, що відображається в розкладі",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Пошта*",
        key: "email",
        text: "Використовується для розподілу навчального навантаження",
        isEditable: true,
        inputType: "email",
        variant: "input",
        items: [],
      },
      {
        title: "Пароль*",
        key: "password",
        text: "Використовується для розподілу навчального навантаження",
        isEditable: true,
        inputType: "text",
        variant: "input",
        items: [],
      },
      {
        title: "Ролі*",
        key: "roles",
        text: "Використовується для розподілу навчального навантаження",
        isEditable: true,
        inputType: "text",
        variant: "multi-select",
        items: sortByName(roles),
      },
    ],
    [],
  );

  const [userFormData, setUserFormData] = useState<Partial<FormData>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const formData = {
    ...(user ? user : {}),
    ...userFormData,
  };

  const validate = () => {
    const res = formSchema.safeParse(formData);
    if (res.success) return;
    return res.error.format();
  };

  const errors = showErrors ? validate() : undefined;

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setModalType("update");
    }
  };

  const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    try {
      // e.preventDefault();
      // setIsPending(true);
      // const errors = validate();
      // if (errors) {
      //   setShowErrors(true);
      //   return;
      // }
      // if (modalType === "create") {
      //   const payload = { name: formData.name, cmk: formData.cmk, planId: Number(planId) };
      //   await dispatch(createPlanSubjects(payload));
      //   onOpenChange(false);
      //   return;
      // }
      // if (modalType === "update" && user) {
      //   const payload = {
      //     cmk: formData.cmk,
      //     newName: formData.name,
      //     planId: Number(planId),
      //     oldName: user.name,
      //   };
      //   await dispatch(updatePlanSubjectsName(payload));
      //   onOpenChange(false);
      // }
    } finally {
      setIsPending(false);
    }
  };

  const onSubmitClick = () => {
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  };

  const deleteSemesterConfirmation = async () => {
    alert("Якщо раніше був вибраний план - перевіряю чи не вибрано інший");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 !py-4 max-w-[600px] gap-0">
        <DialogHeader className="px-4 pb-4">
          <DialogTitle className="flex items-center gap-1">
            {user && modalType === "update" && user.name}
            {modalType === "create" && "Нова дисципліна"}
          </DialogTitle>

          <div className="flex justify-between items-center leading-[1.25] opacity-[.6] text-sm">
            <p>{user ? `ЦК ${user.id}` : ""}</p>
          </div>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form className="px-6 py-4" onSubmit={handleSubmit}>
            {formFields.map((input) => {
              const currentValue = formData[input.key as keyof FormData] as FormData[keyof FormData];

              return (
                <EntityField
                  {...input}
                  errors={errors}
                  isUpdate={false}
                  inputKey={input.key}
                  isEditable={!isPending}
                  labelClassNames="min-w-65"
                  classNames="flex-col gap-1"
                  currentValue={currentValue}
                  setUserFormData={setUserFormData}
                  inputType={input.inputType as "string" | "number"}
                  variant={input.variant as "input" | "select" | "button"}
                />
              );
            })}

            <button className="hidden" ref={submitButtonRef}></button>
          </form>
        </DialogDescription>

        <Separator />

        <DialogFooter className="flex items-center pt-4 px-4">
          {modalType === "update" && (
            <Button disabled={isPending} onClick={deleteSemesterConfirmation} variant="destructive">
              Видалити
            </Button>
          )}

          <Button disabled={isPending} onClick={onSubmitClick}>
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountsModal;
