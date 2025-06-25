import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useEffect, type Dispatch, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { LoadingStatusTypes } from "~/store/app-types";
import type { ISelectedLesson } from "~/pages/timetable-page";
import { getLessonRemark } from "~/helpers/get-lesson-remark";
import { generalSelector } from "~/store/general/general-slice";
import type { GroupLoadType } from "~/store/groups/groups-types";
import LoadingSpinner from "~/components/ui/icons/loading-spinner";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { getTimetableTableLessons } from "~/helpers/get-timetable-table-lessons";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import type { ScheduleLessonType } from "~/store/schedule-lessons/schedule-lessons-types";
import { findLessonsForSchedule } from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { findLessonsCountForLessonsTable } from "~/helpers/find-lessons-count-for-lessons-table";
import { clearGroupLoad, scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";

interface ILessonsTableProps {
  selectedSemester: number | null;
  selectedLesson: ISelectedLesson | null;
  setSelectedTeacherId: Dispatch<SetStateAction<number | null>>;
  setIsPossibleToCreateLessons: Dispatch<SetStateAction<boolean>>;
  setSelectedLesson: Dispatch<SetStateAction<ISelectedLesson | null>>;
}

export const LessonsTable: React.FC<ILessonsTableProps> = ({
  selectedLesson,
  selectedSemester,
  setSelectedLesson,
  setSelectedTeacherId,
  setIsPossibleToCreateLessons,
}) => {
  const dispatch = useAppDispatch();

  const {
    timetable: { item, type },
  } = useSelector(generalSelector);
  const { groupLoad, loadingStatus, scheduleLessons } = useSelector(scheduleLessonsSelector);
  // const [sorting, setSorting] = React.useState<SortingState>(orderField ? [{ id: orderField, desc: isOrderDesc }] : []);

  const handleSelectLesson = (lesson: GroupLoadType | ScheduleLessonType) => {
    if (!lesson || !lesson.teacher) return;

    const studentsCount = typeof lesson.students === "number" ? lesson.students : lesson.students?.length;

    setSelectedLesson({
      id: lesson.id,
      name: lesson.name,
      replacement: null,
      typeRu: lesson.typeRu,
      stream: lesson.stream,
      currentLessonHours: 2,
      teacher: lesson.teacher,
      students: studentsCount,
      totalHours: lesson.hours,
      subgroupNumber: lesson.subgroupNumber,
      specialization: lesson.specialization,
      group: { id: lesson.group.id, name: lesson.group.name },
    });
    setSelectedTeacherId(lesson.teacher.id);
  };

  const columnHelper = createColumnHelper<GroupLoadType | ScheduleLessonType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Дисципліна" }),
      columnHelper.accessor((row) => getTeacherFullname(row.teacher, "short"), {
        id: "category",
        header: "Викладач",
        cell: (info) => info.getValue(),
      }),

      columnHelper.display({
        id: "remark",
        header: "Примітка",
        cell: ({ row }) => {
          const { stream, typeRu, subgroupNumber, specialization, group } = row.original;
          const streamGroups = stream?.groups.map((group) => group.name).join(", ");
          const remark = getLessonRemark({ stream, typeRu, subgroupNumber, specialization });

          return (
            <Tooltip delayDuration={500}>
              <TooltipTrigger className="truncate w-16">{remark}</TooltipTrigger>
              <TooltipContent>
                {`${remark} 
                  ${type !== "group" ? ` ⋅ Група: ${group.name}` : ""} 
                  ${stream ? ` ⋅ Групи потоку: ${streamGroups}` : ""}`}
              </TooltipContent>
            </Tooltip>
          );
        },
      }),

      columnHelper.accessor("hours", { header: "План" }),

      columnHelper.display({
        id: "fact",
        header: "Факт",
        cell: ({ row }) => {
          const exhibitedLessonsCount = findLessonsCountForLessonsTable(
            row.original.name,
            row.original.group.id,
            row.original.subgroupNumber,
            row.original.stream?.id,
            row.original.typeRu,
            scheduleLessons,
          );
          return exhibitedLessonsCount;
        },
      }),
    ],
    [],
  );

  const tableData = useMemo(
    () => getTimetableTableLessons(groupLoad, scheduleLessons, type),
    [groupLoad, scheduleLessons, type],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    // state: { sorting },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // globalFilterFn: "fuzzy",
    filterFns: { fuzzy: fuzzyFilter },
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isEmptyTable =
    type !== "auditory" ? !groupLoad || !groupLoad.length : !scheduleLessons || !scheduleLessons.length;

  useEffect(() => {
    if (!item) return;

    if (type === "group" || type === "teacher") {
      dispatch(clearGroupLoad());
      const semester = !isNaN(Number(selectedSemester)) ? Number(selectedSemester) : 1;
      dispatch(findLessonsForSchedule({ semester, itemId: item, scheduleType: type }));
    }
  }, [item, selectedSemester]);

  useEffect(() => {
    if (!selectedLesson) return;
    // К-ть виставлених годин
    const exhibitedLessonsCount = findLessonsCountForLessonsTable(
      selectedLesson.name,
      selectedLesson.group.id,
      selectedLesson.subgroupNumber,
      selectedLesson.stream?.id,
      selectedLesson.typeRu,
      scheduleLessons,
    );

    if (exhibitedLessonsCount === selectedLesson.totalHours) {
      // Якщо виставлено ел.розкладу стільки скільки заплановано
      // false === заборонено створювати нові ел.розкладу
      setIsPossibleToCreateLessons(false);
    } else {
      setIsPossibleToCreateLessons(true);
    }
  }, [selectedLesson, scheduleLessons]);

  return (
    <Table className="w-full">
      <TableHeader className="h-12">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-white">
            {headerGroup.headers.map((header, index) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan} className="text-xs">
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(index !== 6 ? "cursor-pointer select-none text-left" : "text-right")}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      <p className="inline-flex relative uppercase font-mono">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUp className="w-4 absolute right-[-20px]" />,
                          desc: <ArrowDown className="w-4 absolute right-[-20px]" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </p>
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {!groupLoad && loadingStatus === LoadingStatusTypes.LOADING ? (
          <TableRow className="hover:bg-white">
            <TableCell colSpan={5}>
              <LoadingSpinner />
            </TableCell>
          </TableRow>
        ) : isEmptyTable ? (
          <TableRow className="hover:bg-white">
            <TableCell colSpan={5}>
              <p className="font-mono text-center py-10">Пусто</p>
            </TableCell>
          </TableRow>
        ) : null}

        {table.getRowModel().rows.map((lessonsData) => {
          const lesson = lessonsData.original;
          return (
            <TableRow key={lesson.id} className="hover:bg-border/40" onClick={() => handleSelectLesson(lesson)}>
              {lessonsData.getVisibleCells().map((cell, index) => {
                const isActionsCol = index === lessonsData.getVisibleCells().length - 1;

                const exhibitedLessonsCount = findLessonsCountForLessonsTable(
                  lesson.name,
                  lesson.group.id,
                  lesson.subgroupNumber,
                  lesson.stream?.id,
                  lesson.typeRu,
                  scheduleLessons,
                );

                const isEqualPlannedAndActuallyHours = exhibitedLessonsCount === lesson.hours;

                const isSelected =
                  lesson.name === selectedLesson?.name &&
                  lesson.group.id === selectedLesson?.group.id &&
                  lesson.stream?.id === selectedLesson?.stream?.id &&
                  lesson.subgroupNumber === selectedLesson?.subgroupNumber &&
                  lesson.typeRu === selectedLesson?.typeRu &&
                  lesson.specialization === selectedLesson?.specialization;

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "text-left px-2 py-1 text-xs cursor-pointer",
                      isActionsCol ? "!text-right" : "",
                      index === 0 ? "truncate max-w-[160px]" : "",
                      isSelected ? "!text-primary !bg-primary-light" : "",
                      isEqualPlannedAndActuallyHours ? "opacity-[0.4]" : "",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
