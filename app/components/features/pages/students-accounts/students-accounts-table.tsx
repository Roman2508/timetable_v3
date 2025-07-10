import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  type SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import StudentsActions from "./students-actions";
import { Badge } from "~/components/ui/common/badge";
import { studentsSelector } from "~/store/students/students-slice";
import type { StudentType } from "~/store/students/students-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Checkbox } from "~/components/ui/common/checkbox";

interface IStudentsAccountsTableProps {
  globalFilter: string;
  studentsIdsToDelete: number[];
  actionMode: "delete" | "create" | "update";
  handleAddStudentToDelete: (id: number) => void;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setStudentsIdsToDelete: Dispatch<SetStateAction<number[]>>;
}

export const StudentsAccountsTable: FC<IStudentsAccountsTableProps> = ({
  actionMode,
  globalFilter,
  setGlobalFilter,
  studentsIdsToDelete,
  setStudentsIdsToDelete,
  handleAddStudentToDelete,
}) => {
  const { students } = useSelector(studentsSelector);

  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<StudentType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "ПІБ" }),
      columnHelper.accessor("login", { header: "Логін" }),
      columnHelper.accessor("password", { header: "Пароль" }),
      columnHelper.accessor("email", { header: "Пошта" }),

      columnHelper.display({
        id: "status",
        header: "Статус",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant="outline"
              className={cn(
                "border-0",
                status === "Навчається" ? "text-success bg-success-background" : "",
                status === "Відраховано" ? "text-error bg-error-background" : "",
                status === "Академічна відпустка" ? "text-primary bg-primary-light" : "",
              )}
            >
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => {
          return <StudentsActions {...row.original} />;
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: students || [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    globalFilterFn: "auto",
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!students) {
    return <div className="font-mono text-center py-4">Пусто.</div>;
  }

  if (students && !students.length) {
    return <div className="font-mono text-center py-4">Студентів ще не зараховано до групи.</div>;
  }

  return (
    <div className="block max-w-full">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-white">
              {actionMode === "delete" && (
                <TableHead className="!text-left font-mono !w-8">
                  <Checkbox
                    onCheckedChange={() => {
                      if (studentsIdsToDelete.length === students.length) {
                        setStudentsIdsToDelete([]);
                      } else {
                        const allIds = students.map((student) => student.id);
                        setStudentsIdsToDelete(allIds);
                      }
                    }}
                  />
                </TableHead>
              )}

              <TableHead className="!text-left font-mono">
                <div className="cursor-default select-none text-left">
                  <p className="inline-flex relative uppercase font-mono">№</p>
                </div>
              </TableHead>

              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(index === 2 ? "!max-w-15 p-0" : "p-0", index === 5 ? "!text-right" : "")}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() ? "cursor-pointer select-none text-left p-0" : "text-left",
                          index === 5 ? "!text-right" : "",
                        )}
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
                        <p className={cn("inline-flex relative !text-left font-mono uppercase")}>
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
          {table.getRowModel().rows.map((row, rowIndex) => {
            const isAddedToDelete = studentsIdsToDelete.some((id) => id === row.original.id);
            return (
              <TableRow key={row.id} className="hover:bg-border/40 cursor-pointer">
                {actionMode === "delete" && (
                  <TableHead className="!text-left font-mono !w-8">
                    <Checkbox
                      checked={isAddedToDelete}
                      onCheckedChange={() => handleAddStudentToDelete(row.original.id)}
                    />
                  </TableHead>
                )}

                <TableCell className={cn("truncate max-w-[30px]", "text-left px-2")}>{rowIndex + 1}</TableCell>

                {row.getVisibleCells().map((cell, index) => {
                  const isLastCol = index === row.getVisibleCells().length - 1;
                  const isFirstCol = index === 0;
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "p-0",
                        isLastCol ? "!text-right" : "!text-left",
                        isFirstCol ? "truncate max-w-[200px]" : "",
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
    </div>
  );
};
