import React from "react";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingFn,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
  Plus,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/common/pagination";

import { cn } from "~/lib/utils";
import { makeData, type Person } from "./make-data";
import { Button } from "~/components/ui/common/button";
import { Checkbox } from "~/components/ui/common/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { Input } from "~/components/ui/common/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { InputSearch } from "~/components/ui/custom/input-search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <InputSearch onChange={(e) => setValue(e.target.value)} placeholder="Пошук..." value={value} {...props} />;
}

export const DistributionLessonsTable = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Дисципліна",
        rowSpan: 3,
        footer: (props) => props.column.id,
        // columns: [
        //   {
        //     accessorKey: "name",
        //     cell: (info) => info.getValue(),
        //     footer: (props) => props.column.id,
        //   },
        // ],
      },
      {
        accessorKey: "cmk",
        header: "ЦК",
        rowSpan: 3,
        footer: (props) => props.column.id,
      },
      {
        header: "Семестр",
        accessorKey: "semester",
        footer: (props) => props.column.id,
        rowSpan: 3,
        // columns: [
        //   {
        //     accessorFn: (row) => row.lastName,
        //     id: "age",
        //     cell: (info) => info.getValue(),
        //     header: () => <span>Last Name</span>,
        //     footer: (props) => props.column.id,
        //   },
        // ],
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
      <div className="block max-w-full">
        <Table className="w-full overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={index === 2 ? "!max-w-15 p-0" : "p-0"}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.column.getCanSort() ? "cursor-pointer select-none text-left p-0" : "",
                            index === 2 ? "text-center" : "",
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
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="hover:bg-border/40 cursor-pointer">
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          index === 0 ? "truncate max-w-[200px]" : "",
                          "px-0 py-1",
                          index === 2 ? "text-center" : "",
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
