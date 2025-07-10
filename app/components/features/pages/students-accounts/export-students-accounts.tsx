import * as XLSX from "xlsx";
import { useState, type FC } from "react";
import { ArrowRightFromLine } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import type { GroupsShortType } from "~/store/groups/groups-types";
import type { StudentType } from "~/store/students/students-types";
import { getStudentsByGroupId } from "~/store/students/students-async-actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";

interface IExportStudentsProps {
  selectedGroup: GroupsShortType | null;
}

const ExportStudentsAccounts: FC<IExportStudentsProps> = ({ selectedGroup }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      if (!selectedGroup) {
        // toast.warning("Групу не вибрано");
        return;
      }

      setIsDisabled(true);

      const { payload } = await dispatch(getStudentsByGroupId(selectedGroup.id));
      const students = payload as StudentType[];

      if (!students.length) {
        // toast.warning("Облікові записи не знайдено");
        return;
      }

      const newData = students.map((student) => {
        const { name, login, email, password, status, group, id } = student;

        return {
          ["Name [Required]"]: name,
          ["login [Required]"]: login,
          ["Password [Required]"]: password,
          ["Email Address [Required]"]: email,
          ["Status [Required]"]: status,
          ["Group ID [Required]"]: group.id,
          ["ID [Required]"]: id,
        };
      });

      return newData.filter((el) => !!Object.keys(el).length);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleExportFile = async () => {
    const wb = XLSX.utils.book_new();

    const data = (await fetchData()) as any[];

    const ws = XLSX.utils.json_to_sheet(data);

    let newObj: any = {};

    // Видаляю всі undefined з об`єкта
    for (var k in newObj) {
      if (!newObj[k]) {
        delete newObj[k];
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Лист 1");
    XLSX.writeFile(wb, "students.xlsx");
  };

  return (
    <>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <Button variant="outline" onClick={handleExportFile} disabled={isDisabled}>
            <ArrowRightFromLine className="rotate-270" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Експортувати студентів групи в Excel</TooltipContent>
      </Tooltip>
    </>
  );
};

export default ExportStudentsAccounts;
