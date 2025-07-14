import * as XLSX from "xlsx";
import { type FC } from "react";
import { useSelector } from "react-redux";

import { Button } from "~/components/ui/common/button";
import { sortItemsByKey } from "~/helpers/sort-items-by-key";
import { teacherProfileSelector } from "~/store/teacher-profile/teacher-profile-slice";
import type { InstructionalMaterialsType } from "~/store/teacher-profile/teacher-profile-types";

const ExportLessonThemes: FC = () => {
  const { instructionalMaterials } = useSelector(teacherProfileSelector);

  const handleExport = () => {
    if (!instructionalMaterials) return;

    const sortedMaterials = sortItemsByKey(instructionalMaterials, "lessonNumber");

    const themes = sortedMaterials.map((el: InstructionalMaterialsType) => {
      return {
        lessonNumber: el.lessonNumber,
        lessonName: el.name,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(themes);

    let newObj: any = {};

    // Зміщую всі рядки на 1 вверх, щоб прибрати шапку таблиці
    for (var k in ws) {
      if (k !== "!ref") {
        const rowNum = k.length === 2 ? k[1] : k.length === 3 ? `${k[1]}${k[2]}` : `${k[1]}${k[2]}${k[3]}`;

        newObj[`${k[0]}${rowNum}`] = ws[`${k[0]}${Number(rowNum) + 1}`];
      } else {
        newObj["!ref"] = ws["!ref"];
      }
    }

    // Видаляю всі undefined з об`єкта
    for (var k in newObj) {
      if (!newObj[k]) {
        delete newObj[k];
      }
    }

    XLSX.utils.book_append_sheet(wb, newObj, "Лист 1");
    XLSX.writeFile(wb, `${instructionalMaterials[0].lesson.name}.xlsx`);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={!instructionalMaterials || !instructionalMaterials.length}
      style={{ textTransform: "initial", whiteSpace: "nowrap", padding: "7.32px 15px" }}
    >
      Експортувати теми
    </Button>
  );
};

export default ExportLessonThemes;
