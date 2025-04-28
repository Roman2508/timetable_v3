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
import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "~/lib/utils";
import { makeData, type Person } from "./make-data";
import AbsentIcon from "~/components/ui/icons/absent-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";

export const GradeBookTable = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Студент",
        rowSpan: 3,
        footer: (props) => props.column.id,
      },
      ...Array(20)
        .fill(null)
        .map((_, index) => ({
          accessorKey: String(index + 1),
          header: String(index + 1),
          rowSpan: 3,
          footer: (props) => props.column.id,
        })),
    ],
    [],
  );

  const [data, setData] = React.useState(() => makeData(1000));
  const refreshData = () => setData(() => makeData(1000));

  const [pagination, setPagination] = React.useState<PaginationState>({
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
        <Table className="block w-full overflow-auto border max-h-[calc(100vh-165px)] relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        index === 0
                          ? "max-w-[200px] sticky left-0 !z-30 bg-primary p-0 translate-x-[-1px]"
                          : "min-w-[100px]",
                        "border-x sticky top-0 z-20 bg-background",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.column.getCanSort() ? "cursor-pointer select-none text-center p-0" : "",
                            index === 0 ? "border-r h-full flex items-center justify-center" : "",
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
                          <p className={cn("inline-flex relative", index === 2 ? "" : "text-left")}>
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
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          index === 0
                            ? "truncate max-w-[300px] border-l sticky left-0 z-10 bg-background translate-x-[-1px] p-0"
                            : "min-w-[80px] text-center p-2 py-1 border-x",
                          "",
                        )}
                      >
                        <div className={index === 0 ? "p-2 py-1 border-r" : "flex items-center justify-center"}>
                          {index !== 0 && <AbsentIcon />}
                          <div className={index !== 0 ? "w-12" : ""}>
                            {index === 0 && `${rowIndex + 1}. `}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
