import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Form, type ActionFunctionArgs } from "react-router";
import { Separator } from "~/components/ui/common/separator";
import type { CategoryFormData, GroupCategoryModalStateType } from "~/components/features/pages/groups/groups-types";
import { categorySchema } from "./groups-form-schema";
import { useAppDispatch } from "~/store/store";
import { createGroupCategory } from "~/store/groups/groups-async-actions";

interface ICategoryActionsModalProps {
  modalData: GroupCategoryModalStateType;
  setModalData: React.Dispatch<React.SetStateAction<GroupCategoryModalStateType>>;
}

const CategoryActionsModal: React.FC<ICategoryActionsModalProps> = ({ modalData, setModalData }) => {
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
      name: "",
      shortName: "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    const { name, shortName } = data;

    if (modalData.actionType === "create") {
      // setOpen(false)
      await dispatch(createGroupCategory({ name, shortName }));
      reset();
      // setValue("name", "");
      // setValue("shortName", "");
      setModalData({ isOpen: false, actionType: "create" });
      return;
    }

    if (modalData.actionType === "update" && "activeGroupCategory") {
      // setOpen(false)
      // await dispatch(updateGroupCategory({ id: activeGroupCategory.id, name: data.name }))
      // setActiveGroupCategory((prev) => {
      //   if (prev) {
      //     return { ...prev, name: data.name }
      //   } else {
      //     return prev
      //   }
      // })
    }
  };

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
              {errors.name?.message && <p>{errors.name.message}</p>}
            </div>

            <div className="mb-8 mt-1 flex flex-col gap-1">
              <h5 className="text-md">Коротка назва*</h5>
              <Input {...register("shortName")} className="" />
              {errors.shortName?.message && <p>{errors.shortName.message}</p>}
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
