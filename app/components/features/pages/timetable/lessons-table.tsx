import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { generalSelector } from "~/store/general/general-slice";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import type { GroupLoadType, GroupsShortType } from "~/store/groups/groups-types";
import { clearGroupLoad, scheduleLessonsSelector } from "~/store/schedule-lessons/schedule-lessons-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { findLessonsForSchedule } from "~/store/schedule-lessons/schedule-lessons-async-actions";

interface ILessonsTableProps {
  //
}

export const LessonsTable: React.FC<ILessonsTableProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [_, setCookie] = useCookies();

  // const { auditories: { isOrderDesc, orderField } } = useSelector(generalSelector);
  const { groupLoad, loadingStatus, scheduleLessons } = useSelector(scheduleLessonsSelector);
  // const [sorting, setSorting] = React.useState<SortingState>(orderField ? [{ id: orderField, desc: isOrderDesc }] : []);

  const columnHelper = createColumnHelper<GroupLoadType>();
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
          return 123;
        },
      }),

      columnHelper.display({
        id: "plan",
        header: "План",
        cell: ({ row }) => {
          return 1;
        },
      }),

      columnHelper.display({
        id: "fact",
        header: "Факт",
        cell: ({ row }) => {
          return 1;
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: groupLoad || [],
    columns,
    // state: { sorting },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // globalFilterFn: "fuzzy",
    filterFns: { fuzzy: fuzzyFilter },
    getFilteredRowModel: getFilteredRowModel(),
  });

  const lastSelectedItemId = 1;
  const lastSelectedScheduleType = "group";
  const selectedSemester = 1;

  useEffect(() => {
    if (!lastSelectedItemId) return;

    if (lastSelectedScheduleType === "group" || lastSelectedScheduleType === "teacher") {
      dispatch(clearGroupLoad());
      const semester = selectedSemester;
      const itemId = lastSelectedItemId;
      const scheduleType = lastSelectedScheduleType;
      dispatch(findLessonsForSchedule({ semester, itemId, scheduleType }));
    }
  }, [lastSelectedItemId, /* lastSelectedScheduleType, */ selectedSemester]);

  // React.useEffect(() => {
  //   if (sorting.length) {
  //     setCookie(GROUP_SORT_KEY, sorting[0].id);
  //     setCookie(GROUP_SORT_TYPE, sorting[0].desc);
  //   } else {
  //     setCookie(GROUP_SORT_KEY, "");
  //     setCookie(GROUP_SORT_TYPE, false);
  //   }
  // }, [sorting]);

  return (
    <Table className="w-full">
      <TableHeader>
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
        {table.getRowModel().rows.map((groupData) => {
          const group = groupData.original;
          return (
            <TableRow key={group.id} className="hover:bg-border/40">
              {groupData.getVisibleCells().map((cell, index) => {
                const isActionsCol = index === groupData.getVisibleCells().length - 1;
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "text-left px-2 py-1 text-xs cursor-pointer",
                      isActionsCol ? "!text-right" : "",
                      index === 0 ? "truncate max-w-[160px]" : "",
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
