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
import { ArrowDown, ArrowUp, ChevronDown, ListFilter, Plus } from "lucide-react";

import { cn } from "~/lib/utils";
import { makeData, type Person } from "./make-data";
import { Button } from "~/components/ui/common/button";
import { Checkbox } from "~/components/ui/common/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/common/popover";
import { Input } from "~/components/ui/common/input";

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

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
  // return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
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
      <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
        <div className="flex items-center gap-4 mb-2">
          <DebouncedInput
            value={globalFilter ?? ""}
            placeholder="Пошук..."
            className="p-2 font-lg shadow border border-block"
            onChange={(value) => setGlobalFilter(String(value))}
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

        <div className="h-2" />
        <table className="w-full ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
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
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
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
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="hover:bg-border/40">
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <td key={cell.id} className={cn(index === 0 ? "" : "text-center", "hover:bg-border/50")}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {">"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
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
