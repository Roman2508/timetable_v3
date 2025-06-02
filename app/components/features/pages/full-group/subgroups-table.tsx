import React from "react";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { rankItem } from "@tanstack/match-sorter-utils";

import {
  type SubgroupsLessonsType,
  groupLessonByNameSubgroupsAndSemester,
} from "~/helpers/group-lesson-by-name-subgroups-and-semester";
import { cn } from "~/lib/utils";
import type { GroupLoadType } from "~/store/groups/groups-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";

const getItemKey = (item: any) => {
  if (!item) return "";
  return `${item.groupId}_${item.planSubjectId}_${item.name}_${item.semester}`;
};

interface ISubgroupsTableProps {
  globalSearch: string;
  groupLoad: GroupLoadType[];
  selectedLesson: SubgroupsLessonsType | null;
  setGlobalSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLesson: React.Dispatch<React.SetStateAction<SubgroupsLessonsType | null>>;
}

export const SubgroupsTable: React.FC<ISubgroupsTableProps> = ({
  groupLoad,
  globalSearch,
  selectedLesson,
  setGlobalSearch,
  setSelectedLesson,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const lessons = React.useMemo(() => (groupLoad ? groupLessonByNameSubgroupsAndSemester(groupLoad) : []), [groupLoad]);

  const columnHelper = createColumnHelper<SubgroupsLessonsType>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", { header: "Дисципліна" }),
      columnHelper.accessor("semester", { header: "Семестр" }),
      columnHelper.accessor("lectures", { header: "Лекції" }),
      columnHelper.accessor("practical", { header: "Практичні" }),
      columnHelper.accessor("laboratory", { header: "Лабораторні" }),
      columnHelper.accessor("seminars", { header: "Семінари" }),
      columnHelper.accessor("exams", { header: "Екзамени" }),
    ],
    [],
  );

  const table = useReactTable({
    data: lessons,
    columns,
    state: { sorting, globalFilter: globalSearch },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSelectLesson = (lesson: any) => {
    setSelectedLesson((prev) => {
      if (!prev) {
        return lesson;
      }
      const isCurrent = getItemKey(prev) === getItemKey(lesson);
      if (isCurrent) {
        return null;
      } else {
        return lesson;
      }
    });
  };

  return (
    <Table className="w-full mb-8">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-white">
            <TableHead className="!text-left font-mono">
              <div className="cursor-pointer select-none text-left">
                <p className="inline-flex relative uppercase font-mono">№</p>
              </div>
            </TableHead>

            {headerGroup.headers.map((header, index) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
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
        {table.getRowModel().rows.map((lessonData, index) => {
          const key = getItemKey(lessonData.original);
          const isSelected = key === getItemKey(selectedLesson);

          return (
            <TableRow
              key={index}
              onClick={() => handleSelectLesson(lessonData.original)}
              className={cn("hover:bg-border/40 cursor-pointer", isSelected ? "bg-primary-light text-primary" : "")}
            >
              <TableCell className={cn("truncate max-w-[30px]", "text-left px-2 py-1")}>{index + 1}</TableCell>

              {lessonData.getVisibleCells().map((cell, index) => {
                const isLastCol = index === lessonData.getVisibleCells().length - 1;

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "text-left px-2 py-1",
                      isLastCol ? "!text-right" : "",
                      index === 0 ? "truncate max-w-[200px]" : "",
                    )}
                  >
                    {cell.getValue() ? flexRender(cell.column.columnDef.cell, cell.getContext()) : "-"}
                    {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
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
