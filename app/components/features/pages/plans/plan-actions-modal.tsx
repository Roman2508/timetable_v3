import z from "zod";
import { useState, type Dispatch, type FC, type SetStateAction } from "react";

import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import type { PlanActionModalType } from "~/pages/plans/plans-page";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "~/components/ui/common/dialog";

interface IPlanActionsModalProps {
  modalData: PlanActionModalType;
  editableCategory: { id: number; name: string } | null;
  setModalData: Dispatch<SetStateAction<PlanActionModalType>>;
  setEditableCategory: Dispatch<SetStateAction<{ id: number; name: string } | null>>;
}

const initialFormData = { name: "" };

const formSchema = z.object({
  name: z.string({ message: "Це поле обов'язкове" }).min(3, { message: "Мінімальна довжина - 3 символа" }),
});

export type FormData = z.infer<typeof formSchema>;

const PlanActionsModal: FC<IPlanActionsModalProps> = ({
  modalData,
  setModalData,
  editableCategory,
  setEditableCategory,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [userFormData, setUserFormData] = useState<Partial<FormData>>({});

  const formData = {
    ...initialFormData,
    ...editableCategory,
    ...userFormData,
  };

  const reset = () => {
    setEditableCategory(null);
    setUserFormData({});
  };

  const onOpenChange = (value: boolean) => {
    setModalData((prev) => ({ ...prev, isOpen: value }));
    if (!value) reset();
  };

  const validate = () => {
    const res = formSchema.safeParse(formData);
    if (res.success) return;
    return res.error.format();
  };

  const errors = showErrors ? validate() : undefined;

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();

    if (errors) {
      setShowErrors(true);
      return;
    }

    try {
      setIsPending(true);
      if (modalData.type === "create-category") {
        // await onCreateCategory(formData);
        setModalData({ isOpen: false, type: "create-plan" });
        reset();
        return;
      }

      if (modalData.type === "update-category" && editableCategory) {
        // await onUpdateCategory({ id: updatingCategory.id, ...formData });
        setModalData({ isOpen: false, type: "create-plan" });
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
            {modalData.type === "create-plan" && "Створити новий план:"}
            {modalData.type === "create-category" && "Створити нову категорію:"}
            {modalData.type === "update-category" && "Оновити підрозділ:"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-1 flex flex-col gap-1">
              <h5 className="text-md">{modalData.type.includes("category") ? "Назва підрозділу*" : "Назва плану*"}</h5>
              <Input
                value={formData.name}
                onChange={(e) => setUserFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              <p className="text-error text-sm mt-1">{errors?.name?._errors.join(", ")}</p>
            </div>

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={isPending}>{modalData.type.includes("create") ? "Створити" : "Оновити"}</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PlanActionsModal;
