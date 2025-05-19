import React from "react";
import { useSelector } from "react-redux";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "~/components/ui/common/alert-dialog";
import { useAppDispatch } from "~/store/store";
import { changeConfirmModalStatus, generalSelector } from "~/store/general/general-slice";
import type { ChangeConfirmDialogStateType } from "~/store/general/general-types";

export const onConfirm = (options: ChangeConfirmDialogStateType, dispatch: any) => {
  return new Promise((resolve) => {
    dispatch(
      changeConfirmModalStatus({
        ...options,
        onConfirm: () => {
          resolve(true);
        },
      }),
    );
  });
};

const ConfirmModal = () => {
  const dispatch = useAppDispatch();

  const { confirmModal } = useSelector(generalSelector);

  const accept = () => {
    const newData = { title: "", itemName: "", description: "", answer: true, isOpen: false };
    dispatch(changeConfirmModalStatus(newData));
    confirmModal.onConfirm && confirmModal.onConfirm();
  };

  const reject = () => {
    const newData = { title: "", itemName: "", description: "", answer: false, isOpen: false };
    dispatch(changeConfirmModalStatus(newData));
  };

  React.useEffect(() => {
    const newData = { ...confirmModal, answer: false };
    dispatch(changeConfirmModalStatus(newData));
  }, []);

  return (
    <AlertDialog open={confirmModal.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {confirmModal.title}
            <br />
            {confirmModal.itemName}
          </AlertDialogTitle>
          <AlertDialogDescription>{confirmModal.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reject}>Закрити</AlertDialogCancel>
          <AlertDialogAction onClick={accept}>Продовжити</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
