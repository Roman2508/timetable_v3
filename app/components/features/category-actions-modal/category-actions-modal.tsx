import z from "zod";
import { useState, type Dispatch, type FC, type MouseEvent, type SetStateAction } from "react";

import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { CategoryModalStateType, UpdatingCategoryType } from "./category-actions-modal-types";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "~/components/ui/common/dialog";

interface ICategoryActionsModalProps {
  title?: string;
  isOnlyName?: boolean;
  nameLabel?: string;
  shortNameLabel?: string;
  modalData: CategoryModalStateType;
  updatingCategory: UpdatingCategoryType | null;
  onCreateCategory: (data: FormData) => Promise<void>;
  onUpdateCategory: (data: FormData & { id: number }) => Promise<void>;
  setModalData: Dispatch<SetStateAction<CategoryModalStateType>>;
  setUpdatingCategory: Dispatch<SetStateAction<UpdatingCategoryType | null>>;
}

const initialFormData = { name: "", shortName: "" };

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }).min(3, { message: "Мінімальна довжина - 3 символа" }),
  shortName: z.string({ message: "Це поле обов'язкове" }).optional(),
});

export type FormData = z.infer<typeof formSchema>;

const CategoryActionsModal: FC<ICategoryActionsModalProps> = ({
  title,
  modalData,
  isOnlyName,
  setModalData,
  updatingCategory,
  onCreateCategory,
  onUpdateCategory,
  setUpdatingCategory,
  nameLabel = "Назва підрозділу*",
  shortNameLabel = "Коротка назва*",
}) => {
  const [isPending, setIsPending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [userFormData, setUserFormData] = useState<Partial<FormData>>({});
  
  const formData = {
    ...initialFormData,
    ...updatingCategory,
    ...userFormData,
  };

  const reset = () => {
    setUpdatingCategory(null);
    setUserFormData({});
  };

  const onOpenChange = (value: boolean) => {
    setModalData((prev) => ({ ...prev, isOpen: value }));
    if (!value) reset();
  };

  // const validate = () => {
  //   const res = formSchema.safeParse(formData);
  //   if (res.success) return;
  //   return res.error.format();
  // };

  const validate = () => {
    const res = formSchema.safeParse(formData);
    if (!res.success) {
      return res.error.format();
    }

    if (!isOnlyName && !formData.shortName) {
      return { success: false, shortName: { _errors: ["Це поле обов'язкове"] } };
    }
  };

  const errors = showErrors ? validate() : undefined;

  const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();

    if (errors) {
      setShowErrors(true);
      return;
    }

    try {
      setIsPending(true);
      if (modalData.actionType === "create") {
        await onCreateCategory(formData);
        setModalData({ isOpen: false, actionType: "create" });
        reset();
        return;
      }

      if (modalData.actionType === "update" && updatingCategory) {
        await onUpdateCategory({ id: updatingCategory.id, ...formData });
        setModalData({ isOpen: false, actionType: "create" });
        reset();
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={modalData.isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {modalData.actionType === "create" ? (title ? title : "Створити новий підрозділ:") : ""}
            {modalData.actionType === "update" ? (title ? title : "Оновити підрозділ:") : ""}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-1 flex flex-col gap-1">
              <h5 className="text-md">{nameLabel}</h5>
              <Input
                value={formData.name}
                onChange={(e) => setUserFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              {/* @ts-ignore */}
              <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
            </div>

            {!isOnlyName && (
              <div className="mb-8 mt-1 flex flex-col gap-1">
                <h5 className="text-md">{shortNameLabel}</h5>
                <Input
                  value={formData.shortName}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, shortName: e.target.value }))}
                />
                {/* @ts-ignore */}
                <p className="text-error text-sm mt-1">{errors?.shortName?._errors.join(", ")}</p>
              </div>
            )}

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={isPending}>{modalData.actionType === "create" ? "Створити" : "Оновити"}</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryActionsModal;
