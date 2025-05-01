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
import { Badge } from "~/components/ui/common/badge";

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

export const StudentsAccountsTable = () => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: "ПІБ",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "login",
        header: "Логін",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "password",
        header: "Пароль",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "email",
        header: "Ел.пошта",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Статус",
        footer: (props) => props.column.id,
      },
      //   {
      //     accessorKey: "group",
      //     header: "Група",
      //     footer: (props) => props.column.id,
      //   },
    ],
    [],
  );

  const [globalFilter, setGlobalFilter] = React.useState("");

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
                          className={cn(header.column.getCanSort() ? "cursor-pointer select-none text-left p-0" : "")}
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
                          <p className={cn("inline-flex relative text-left opacity-[0.7] font-light uppercase")}>
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
                    const textContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                    const isLastCol = index === row.getVisibleCells().length - 1;
                    let bageClassName = "text-success bg-success-background border-0";
                    if (isLastCol) {
                      console.log(textContent);
                    }
                    if (isLastCol && textContent?.props.row.original.status === "Відраховано") {
                      bageClassName = "text-error bg-error-background border-0";
                    }
                    if (isLastCol && textContent?.props.row.original.status === "Академ.відпустка") {
                      bageClassName = "text-primary bg-primary-light border-0";
                    }

                    return (
                      <TableCell key={cell.id} className={cn(index === 0 ? "truncate max-w-[200px]" : "", "px-0 py-1")}>
                        {!isLastCol ? (
                          textContent
                        ) : (
                          <Badge variant="outline" className={bageClassName}>
                            {textContent}
                          </Badge>
                        )}
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
