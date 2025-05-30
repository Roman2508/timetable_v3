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

export const FullPlanTable = () => {
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
        header: "Всього год.",
        accessorKey: "totalHours",
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
      {
        header: "Розподіл за курсами та семестрами",
        footer: (props) => props.column.id,
        rowSpan: 1,
        columns: [
          {
            accessorKey: "course_1",
            header: () => "1 курс",
            rowSpan: 1,
            footer: (props) => props.column.id,
            columns: [
              {
                rowSpan: 1,
                id: "semester_1",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_1,
                header: () => <span>Семестр 1</span>,
                footer: (props) => props.column.id,
              },
              {
                rowSpan: 1,
                id: "semester_2",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_2,
                header: () => <span>Семестр 2</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            accessorKey: "course_2",
            header: () => "2 курс",
            rowSpan: 1,
            footer: (props) => props.column.id,
            columns: [
              {
                rowSpan: 1,
                id: "semester_3",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_3,
                header: () => <span>Семестр 3</span>,
                footer: (props) => props.column.id,
              },
              {
                rowSpan: 1,
                id: "semester_4",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_4,
                header: () => <span>Семестр 4</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            accessorKey: "progress",
            header: "3 курс",
            rowSpan: 1,
            footer: (props) => props.column.id,
            columns: [
              {
                rowSpan: 1,
                id: "semester_5",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_5,
                header: () => <span>Семестр 5</span>,
                footer: (props) => props.column.id,
              },
              {
                rowSpan: 1,
                id: "semester_6",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_6,
                header: () => <span>Семестр 6</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            accessorKey: "progress",
            header: "4 курс",
            rowSpan: 1,
            footer: (props) => props.column.id,
            columns: [
              {
                rowSpan: 1,
                id: "semester_7",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_7,
                header: () => <span>Семестр 7</span>,
                footer: (props) => props.column.id,
              },
              {
                rowSpan: 1,
                id: "semester_8",
                cell: (info) => info.getValue(),
                accessorFn: (row) => row.semester_8,
                header: () => <span>Семестр 8</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
        ],
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
        <h1 className="text-2xl mb-4">226 Фармація, промислова фармація ОПС ФМБ (заочна форма навчання) 2024</h1>

        <div className="flex items-center gap-4 mb-8">
          <DebouncedInput
            placeholder="Пошук..."
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block w-full"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
              // variant="outline"
              >
                <ListFilter />
                <span className="hidden lg:inline">Фільтр</span>
                <span className="lg:hidden">Фільтр</span>
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all" />
                  <label
                    htmlFor="all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Всі семестри
                  </label>
                </div>

                {["1", "2", "3", "4", "5", "6"].map((item) => {
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox id={item} />
                      <label
                        htmlFor={item}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Семестр {item}
                      </label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="default">
            <Plus />
            <span>Створити</span>
          </Button>
        </div>

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

      <hr />
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(pagination, null, 2)}</pre>
    </>
  );
};
