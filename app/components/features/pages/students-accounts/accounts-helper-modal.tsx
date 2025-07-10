import { type Dispatch, type FC, type SetStateAction } from "react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { AlertDialogHeader } from "~/components/ui/common/alert-dialog";
import { Table, TableCell, TableRow } from "~/components/ui/common/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "~/components/ui/common/dialog";

interface IAccountsHelperModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AccountsHelperModal: FC<IAccountsHelperModalProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-4 gap-0 w-150">
        <AlertDialogHeader className="pb-2 px-4">
          <DialogTitle className="mb-2">В якому форматі має бути Excel файл?</DialogTitle>
        </AlertDialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col mb-4 p-4">
          <p className="mb-2">Структура таблиці:</p>
          <Table className="mb-4 border">
            <TableRow>
              <TableCell className="border">name</TableCell>
              <TableCell className="border">login</TableCell>
              <TableCell className="border">password</TableCell>
              <TableCell className="border">email</TableCell>
              <TableCell className="border">group</TableCell>
            </TableRow>
          </Table>

          <p className="mb-2">- В Exel файлі повинна бути шапка таблиці (формат наведено вище).</p>
          <p className="mb-2">
            - Можна вказувати ID групи або шаблон в форматі [ Категорія/Шифр групи ] (без квадратних дужок)
          </p>
          <p>(категорія і шифр групи повинні повністю збігатись з існуючими).</p>
        </DialogDescription>

        <DialogFooter className="px-4 !items-center !justify-between">
          <Button onClick={() => setOpen(false)}>Закрити</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountsHelperModal;
