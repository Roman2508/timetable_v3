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
import { changeAlertModalStatus, generalSelector } from "~/store/general/general-slice";

const AlertModal = () => {
  const dispatch = useAppDispatch();

  const { alertModal } = useSelector(generalSelector);

  const close = () => {
    const newData = { title: "", text: "", isOpen: false };
    dispatch(changeAlertModalStatus(newData));
  };

  return (
    <AlertDialog open={alertModal.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertModal.title}</AlertDialogTitle>
          <AlertDialogDescription>{alertModal.text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={close}>Закрити</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
