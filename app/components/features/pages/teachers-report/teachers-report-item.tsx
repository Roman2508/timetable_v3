import { Link } from "react-router";
import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

import {
  updateTeacherReport,
  uploadTeacherReportFile,
  deleteTeacherReportFile,
} from "~/store/teacher-profile/teacher-profile-async-actions";
import { cn } from "~/lib/utils";
import debounse from "lodash/debounce";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { InputCalendar } from "~/components/ui/custom/input-calendar";
import type { TeacherReportType } from "~/store/teacher-profile/teacher-profile-types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/common/accordion";

interface ITeachersReportItemProps {
  report: TeacherReportType;
}

const defaultFormData = {
  id: 0,
  hours: 0,
  doneDate: new Date().toLocaleDateString(),
  plannedDate: new Date().toLocaleDateString(),
  description: "report.description",
};

const TeachersReportItem: FC<ITeachersReportItemProps> = ({ report }) => {
  const dispatch = useAppDispatch();

  const inputRef = useRef(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isFileDeleting, setIsFileDeleting] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const [userFormData, setUserFormData] = useState({});

  const formData = {
    ...defaultFormData,
    ...report,
    ...userFormData,
  };

  const handleUpdateStatus = async () => {
    try {
      setIsFetching(true);
      const { hours, status, doneDate, plannedDate, description } = formData;
      const data = { hours, doneDate, plannedDate, description, id: report.id, status: !status };
      await dispatch(updateTeacherReport(data));
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, reportId: number) => {
    try {
      if (!inputRef.current) return;
      setIsFileUploading(true);
      // @ts-ignore
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      await dispatch(uploadTeacherReportFile({ file: formData, id: reportId }));
      // @ts-ignore
      inputRef.current.value = "";
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleDeleteFile = async (e: any, reportId: number, fileId: string) => {
    if (!window.confirm("Ви дійсно хочете видалити файл?")) return;
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsFileDeleting(true);
      await dispatch(deleteTeacherReportFile({ id: reportId, fileId }));
    } finally {
      setIsFileDeleting(false);
    }
  };

  const debouncedUpdateReport = useCallback(
    debounse((payload) => dispatch(updateTeacherReport(payload)), 1000),
    [],
  );

  useEffect(() => {
    const { hours, doneDate, plannedDate, description } = formData;

    const isHoursSame = report.hours === hours;
    const isDoneDateSame = report.doneDate === doneDate;
    const isPlannedDateSame = report.plannedDate === plannedDate;
    const isDescriptionSame = report.description === description;

    if (isHoursSame && isDoneDateSame && isPlannedDateSame && isDescriptionSame) return;
    debouncedUpdateReport({ id: report.id, hours, doneDate, plannedDate, description });
  }, [formData]);

  return (
    <AccordionItem value={`item-${report.id}`} className={cn("mb-4", report.status ? "border-b-primary" : "")}>
      <AccordionTrigger
        className={cn(
          "flex justify-between items-center py-2 border-b-0",
          report.status ? "border-primary text-primary bg-primary-light" : "",
        )}
      >
        <p className="flex-1">{report.individualWork.name}</p>
        <div className={cn("border px-2 py-1", report.status ? "border-primary" : "")}>{report.hours}</div>
        <div className={cn("border px-2 py-1 w-28 text-center", report.status ? "border-primary text-primary" : "")}>
          {report.status ? "Виконано" : "Не виконано"}
        </div>
      </AccordionTrigger>

      <AccordionContent
        className="px-4 pt-4"
        // @ts-ignore
        wrapperClassName={cn(report.status ? "border-primary border-b-0" : "")}
      >
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <p className="text-sm mb-1">Кількість годин*</p>
            <Input
              type="number"
              className="flex-1"
              value={formData.hours}
              onChange={(e) => setUserFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <InputCalendar
            classNames="mb-0 flex-1"
            value={formData.plannedDate}
            label="Планована дата виконання*"
            onValueChange={(plannedDate) => setUserFormData((prev) => ({ ...prev, plannedDate }))}
          />

          <InputCalendar
            classNames="mb-0 flex-1"
            value={formData.doneDate}
            label="Фактично виконано*"
            onValueChange={(doneDate) => setUserFormData((prev) => ({ ...prev, doneDate }))}
          />
        </div>

        <div className="flex-1">
          <p className="text-sm mb-1">Зміст роботи*</p>
          <textarea
            value={formData.description}
            className="w-full rounded-0 p-2 border bg-sidebar resize-none h-20"
            onChange={(e) => setUserFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <div className="flex justify-end flex-wrap gap-1">
            {report.files.map((file) => (
              <Link
                key={file.id}
                target="_blank"
                // preview
                to={`https://drive.google.com/file/d/${file.id}/view`}
                // download
                // to={`https://drive.usercontent.google.com/download?id=${file.id}&export=download&authuser=0&confirm=t`}
              >
                <div className="flex items-center gap-1 border p-1.5 hover:bg-sidebar">
                  {file.name}
                  <button
                    className="border px-1 cursor-pointer"
                    disabled={isFileDeleting || isFileUploading}
                    onClick={(e) => handleDeleteFile(e, report.id, file.id)}
                  >
                    <X className="w-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {!!report.files.length && (
            <div className="px-2">
              <Separator orientation="vertical" />
            </div>
          )}

          <div>
            <input type="file" ref={inputRef} className="hidden" onChange={(e) => handleUploadFile(e, report.id)} />
            <Button
              variant="outline"
              disabled={isFetching || isFileUploading}
              onClick={() => {
                /* @ts-ignore */
                inputRef.current?.click();
              }}
            >
              <Upload /> Завантажити файл
            </Button>
          </div>

          <Button
            onClick={handleUpdateStatus}
            disabled={isFetching || isFileUploading}
            variant={report.status ? "destructive" : "default"}
          >
            {isFetching ? "Завантаження..." : report.status ? "Не виконано" : "Виконано"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TeachersReportItem;
