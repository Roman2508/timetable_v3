import { useState, type Dispatch, type FC, type SetStateAction } from "react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "~/components/ui/common/dialog";
import {
  createIndividualTeacherWork,
  updateIndividualTeacherWork,
} from "~/store/teacher-profile/teacher-profile-async-actions";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import DropdownSelect from "~/components/ui/custom/dropdown-select";
import type { IndividualTeacherWordTypes, IndividualWorkPlanType } from "~/store/teacher-profile/teacher-profile-types";

export const categoriesTypes = [
  { id: 1, name: "Методична робота" },
  { id: 2, name: "Наукова робота" },
  { id: 3, name: "Організаційна робота" },
] as { id: number; name: IndividualTeacherWordTypes }[];

interface Props {
  open: boolean;
  editedWork: IndividualWorkPlanType | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEditedWork: Dispatch<SetStateAction<IndividualWorkPlanType | null>>;
}

const defaultFormData = { name: "", hours: 0, type: categoriesTypes[0].id };

const TeacherActivitiesTypesModal: FC<Props> = ({ open, setOpen, editedWork, setEditedWork }) => {
  const dispatch = useAppDispatch();

  const [isFetching, setIsFetching] = useState(false);
  const [userFormData, setUserFormData] = useState({});

  const formData = {
    ...defaultFormData,
    ...(editedWork || {}),
    type: editedWork ? categoriesTypes.find((el) => el.name === editedWork.type)?.id : categoriesTypes[0].id,
    ...userFormData,
  };

  const onChangeActivity = async () => {
    try {
      setIsFetching(true);
      const { name, hours, type: typeId } = formData;
      const type = categoriesTypes.find((el) => el.id === typeId)?.name;
      if (!type) return;
      const payload = { name, hours, type };

      // update
      if (editedWork) {
        await dispatch(updateIndividualTeacherWork({ ...payload, id: editedWork.id }));
        onOpenChange(false);
        return;
      }

      // create
      await dispatch(createIndividualTeacherWork(payload));
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const onDeleteActivity = () => {
    alert("not exist");
    try {
    } catch (error) {
    } finally {
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setEditedWork(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="pb-4">{editedWork ? "Оновити діяльність" : "Додати діяльність"}</DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription>
          <div className="px-4">
            <div className="mb-4">
              <p className="mb-1 text-sm">Назва</p>
              <Input
                value={formData.name}
                onChange={(e) => setUserFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <p className="mb-1 text-sm">К-ть годин</p>
              <Input
                type="number"
                value={formData.hours}
                onChange={(e) => setUserFormData((prev) => ({ ...prev, hours: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <p className="mb-1 text-sm">Тип діяльності</p>
              <DropdownSelect
                items={categoriesTypes}
                selectedItem={formData.type}
                classNames="w-full bg-sidebar"
                onChange={(type) => setUserFormData((prev) => ({ ...prev, type }))}
              />
            </div>
          </div>
        </DialogDescription>

        <Separator />

        <DialogFooter className="pt-2 px-4">
          <Button
            onClick={onChangeActivity}
            disabled={isFetching || !formData.name || !formData.name || !formData.type}
          >
            {isFetching ? "Завантаження..." : "Зберегти"}
          </Button>

          {editedWork && (
            <Button variant="destructive" onClick={onDeleteActivity} disabled={isFetching}>
              {isFetching ? "Завантаження..." : "Видалити"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherActivitiesTypesModal;
