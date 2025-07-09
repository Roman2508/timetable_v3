import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useMemo, useState, type FC } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";

import { cn } from "~/lib/utils";
import { makeData } from "./make-data";
import StudentsActions from "./students-actions";
import { Badge } from "~/components/ui/common/badge";
import { Button } from "~/components/ui/common/button";
import type { StudentType } from "~/store/students/students-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";

interface IStudentsAccountsTableProps {
  orderField: string;
  isOrderDesc: boolean;
}

export const StudentsAccountsTable: FC<IStudentsAccountsTableProps> = ({ orderField, isOrderDesc }) => {
  const [sorting, setSorting] = useState<SortingState>(orderField ? [{ id: orderField, desc: isOrderDesc }] : []);

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

  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState(() => makeData(1000));
  const refreshData = () => setData(() => makeData(1000));

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div className="block max-w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white">
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
              return (
                <TableRow key={row.id} className="hover:bg-border/40 cursor-pointer">
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

        <div className="flex items-center justify-between mt-4 gap-8">
          <Pagination>
            <PaginationContent className="flex gap-4">
              <PaginationItem onClick={() => table.previousPage()}>
                <PaginationLink href="#" isActive={!table.getCanPreviousPage()}>
                  <Button variant="outline">
                    <ChevronLeft />
                  </Button>
                </PaginationLink>
              </PaginationItem>

              <PaginationItem onClick={() => table.nextPage()}>
                <PaginationLink href="#" isActive={!table.getCanNextPage()}>
                  <Button variant="outline">
                    <ChevronRight />
                  </Button>
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Select
            defaultValue={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={`На сторінці: ${table.getRowModel().rows.length}`} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 75, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  На сторінці: {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
