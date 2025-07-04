import {} from "react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { AlertDialogHeader } from "~/components/ui/common/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "~/components/ui/common/dialog";

const SeveralLessonsModal = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-4 gap-0">
        <AlertDialogHeader className="pb-2 px-4">
          <DialogTitle className="!font-normal text-sm">Тиждень: 1</DialogTitle>
        </AlertDialogHeader>

        <Separator />

        <DialogDescription className="flex flex-col mb-4">
          {/* //  */}
          {/* //  */}
          {/* //  */}
        </DialogDescription>

        <DialogFooter className="px-4">
          <Button className="" variant="destructive">
            Видалити
          </Button>

          <Button className="">Зберегти</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeveralLessonsModal;
