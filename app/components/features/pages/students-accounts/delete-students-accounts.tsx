import { Check, Trash, X } from "lucide-react";
import { useState, type Dispatch, type FC, type SetStateAction } from "react";

import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { deleteStudent } from "~/store/students/students-async-actions";

interface IDeleteStudentsAccountsProps {
  studentsIdsToDelete: number[];
  actionMode: "delete" | "create" | "update";
  setStudentsIdsToDelete: Dispatch<SetStateAction<number[]>>;
  setActionMode: Dispatch<SetStateAction<"delete" | "create" | "update">>;
}

const DeleteStudentsAccounts: FC<IDeleteStudentsAccountsProps> = ({
  actionMode,
  setActionMode,
  studentsIdsToDelete,
  setStudentsIdsToDelete,
}) => {
  const dispatch = useAppDispatch();

  const [isFetching, setIsFetching] = useState(false);

  const cancelDeleting = () => {
    setStudentsIdsToDelete([]);
    setActionMode("create");
  };

  const onDelete = async () => {
    if (!window.confirm("Ви впевнені, що хочете видалити вибраних студентів?")) return;
    if (!studentsIdsToDelete.length) return;

    try {
      setIsFetching(true);

      Promise.all(
        studentsIdsToDelete.map(async (el) => {
          await dispatch(deleteStudent(el));
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      {actionMode === "delete" ? (
        <div className="flex gap-3 mr-3">
          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Button variant="outline" onClick={onDelete} disabled={isFetching || !studentsIdsToDelete.length}>
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Видалити вибраних студентів</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={500}>
            <TooltipTrigger>
              <Button variant="outline" onClick={cancelDeleting} disabled={isFetching}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Відмінити видалення</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="ml-3" />
        </div>
      ) : (
        <Tooltip delayDuration={500}>
          <TooltipTrigger>
            <Button
              variant="outline"
              disabled={isFetching}
              onClick={() => {
                setActionMode((prev) => {
                  if (prev === "delete") return "create";
                  else return "delete";
                });
              }}
            >
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Видалити студентів</TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

export default DeleteStudentsAccounts;
