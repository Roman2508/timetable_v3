import React from "react";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";

import { cn } from "~/lib/utils";
import { makeData, type Person } from "./make-data";
import { Input } from "~/components/ui/common/input";
import { Button } from "~/components/ui/common/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";

export const StreamsLessonsTable = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Дисципліна",
        rowSpan: 3,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "group",
        header: "Група",
        rowSpan: 3,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "semester",
        header: "Семестр",
        footer: (props) => props.column.id,
        rowSpan: 3,
      },
      {
        accessorKey: "lectures",
        header: () => "ЛК",
        rowSpan: 1,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "practical",
        header: () => "ПЗ",
        rowSpan: 1,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "laboratory",
        header: () => "ЛАБ",
        rowSpan: 1,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "seminars",
        header: () => "СЕМ",
        rowSpan: 1,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "exams",
        header: () => "ЕКЗ",
        rowSpan: 1,
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data, setData] = React.useState(() => makeData(1000));
  const refreshData = () => setData(() => makeData(1000));

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
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

  console.log("getHeaderGroups", table.getHeaderGroups());

  return (
    <>
      <div className="p-2 block max-w-full">
        <Table className="w-full ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(header.column.getCanSort() ? "cursor-pointer select-none" : "")}
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
                          <p className="inline-flex relative">
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
          {/* <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan} rowSpan={header.rowSpan}>
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead> */}
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="hover:bg-border/40">
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell key={cell.id} className={cn(index === 0 ? "" : "text-center", "hover:bg-border/50")}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center my-8 gap-8">
          <Pagination>
            <PaginationContent className="flex gap-4">
              <PaginationItem onClick={() => table.setPageIndex(0)}>
                <PaginationLink isActive={!table.getCanPreviousPage()}>
                  <Button variant="outline">
                    <ChevronsLeft />
                  </Button>
                </PaginationLink>
              </PaginationItem>

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

              <PaginationItem onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                <PaginationLink href="#" isActive={!table.getCanNextPage()}>
                  <Button variant="outline">
                    <ChevronsRight />
                  </Button>
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex items-center gap-1 select-none">
            <div>Сторінка</div>
            <p className="font-bold">{table.getState().pagination.pageIndex + 1}</p>
            <p>з</p>
            <p className="font-bold">{table.getPageCount()}</p>
          </div>

          <div className="flex items-center gap-2 select-none">
            Перейти на сторінку:
            <Input
              min="1"
              type="number"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16"
            />
          </div>

          <Select
            defaultValue={String(table.getState().pagination.pageSize)}
            // value={String(table.getState().pagination.pageSize)}
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
