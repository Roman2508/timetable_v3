import React from "react";
import * as XLSX from "xlsx";
import { Button } from "~/components/ui/common/button";
import type { GroupLoadType } from "~/store/groups/groups-types";
import { useAppDispatch } from "~/store/store";
import { importInstructionalMaterials } from "~/store/teacher-profile/teacher-profile-async-actions";

type Props = {
  showedYear: number;
  selectedLesson: GroupLoadType | null;
};

const ImportLessonThemes: React.FC<Props> = ({ showedYear, selectedLesson }) => {
  const dispatch = useAppDispatch();

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleImport = (e: any) => {
    if (!selectedLesson) return;
    e.preventDefault();

    const files = (e.target as HTMLInputElement).files;

    if (!files?.length) return;

    const f = files[0];
    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = e.target?.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const withoutEmpty = dataParse.filter((el: any) => el.length) as [number, string][];

      const themes = withoutEmpty.map((el) => ({ lessonNumber: Number(el[0]), name: el[1] }));

      const isAllValuesExist = themes.some((el) => {
        return isNaN(el.lessonNumber) && typeof Number(el.lessonNumber) !== "number" && typeof el.name !== "string";
      });

      if (isAllValuesExist) {
        // dispatch(setAppAlert({ message: "Помилка при завантаженні тем", status: "error" }));
        return;
      }

      const payload = { lessonId: selectedLesson.id, year: showedYear, themes };

      try {
        setIsLoading(true);
        await dispatch(importInstructionalMaterials(payload));
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(f);

    if (!fileRef.current) return;
    fileRef.current.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" onChange={handleImport} style={{ display: "none" }} />

      <Button
        disabled={!selectedLesson || isLoading}
        onClick={() => fileRef.current?.click()}
        style={{ textTransform: "initial", whiteSpace: "nowrap", padding: "7.32px 15px" }}
      >
        Імпортувати теми
      </Button>
    </>
  );
};

export default ImportLessonThemes;
