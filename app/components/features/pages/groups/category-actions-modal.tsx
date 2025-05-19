import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  CategoryFormData,
  UpdatingCategoryType,
  GroupCategoryModalStateType,
} from "~/components/features/pages/groups/groups-types";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { categorySchema } from "./groups-form-schema";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { createGroupCategory, updateGroupCategory } from "~/store/groups/groups-async-actions";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "~/components/ui/common/dialog";

interface ICategoryActionsModalProps {
  modalData: GroupCategoryModalStateType;
  updatingCategory: UpdatingCategoryType | null;
  setModalData: React.Dispatch<React.SetStateAction<GroupCategoryModalStateType>>;
}

const CategoryActionsModal: React.FC<ICategoryActionsModalProps> = ({ modalData, setModalData, updatingCategory }) => {
  const dispatch = useAppDispatch();

  const onOpenChange = (value: boolean) => {
    setModalData((prev) => ({ ...prev, isOpen: value }));
  };

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: updatingCategory?.name ?? "",
      shortName: updatingCategory?.shortName ?? "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const { name, shortName } = data;

    if (modalData.actionType === "create") {
      await dispatch(createGroupCategory({ name, shortName }));
      setModalData({ isOpen: false, actionType: "create" });
      reset();
      return;
    }

    if (modalData.actionType === "update" && updatingCategory) {
      await dispatch(updateGroupCategory({ id: updatingCategory.id, name: data.name, shortName: data.shortName }));
      setModalData({ isOpen: false, actionType: "create" });
      reset();
    }
  };

  React.useEffect(() => {
    if (!updatingCategory) return;
    setValue("name", updatingCategory.name);
    setValue("shortName", updatingCategory.shortName);
  }, [updatingCategory]);

  return (
    <Dialog open={modalData.isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">
            {modalData.actionType === "create" && "Створити новий підрозділ:"}
            {modalData.actionType === "update" && "Оновити підрозділ:"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 mt-1 flex flex-col gap-1">
              <h5 className="text-md">Назва підрозділу*</h5>
              <Input {...register("name")} className="" />
              {errors.name?.message && <p className="text-error">{errors.name.message}</p>}
            </div>

            <div className="mb-8 mt-1 flex flex-col gap-1">
              <h5 className="text-md">Коротка назва*</h5>
              <Input {...register("shortName")} className="" />
              {errors.shortName?.message && <p className="text-error">{errors.shortName.message}</p>}
            </div>

            <Separator />

            <div className="flex !justify-start pt-6">
              <Button disabled={isSubmitting}>{modalData.actionType === "create" ? "Створити" : "Оновити"}</Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryActionsModal;
