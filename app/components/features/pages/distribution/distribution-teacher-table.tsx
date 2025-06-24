import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Button } from "~/components/ui/common/button";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import type { TeachersType } from "~/store/teachers/teachers-types";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/common/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";
import { useItemsByCategory } from "~/hooks/use-items-by-category";

interface IDistributionTeacherTableProps {
  globalFilter: string;
  selectedTeacherId: number | null;
  selectedTeacherCategories: { id: number }[];
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSelectedTeacherId: Dispatch<SetStateAction<number | null>>;
}

export const DistributionTeacherTable: FC<IDistributionTeacherTableProps> = ({
  globalFilter,
  setGlobalFilter,
  selectedTeacherId,
  setSelectedTeacherId,
  selectedTeacherCategories,
}) => {
  const { teachersCategories } = useSelector(teachersSelector);

  const teachers = useMemo(() => (teachersCategories ?? []).flatMap((el) => el.teachers), [teachersCategories]);
  const filtredTeachers = useItemsByCategory(teachers, selectedTeacherCategories);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const handleSelectTeacher = (teacherId: number) => {
    setSelectedTeacherId((prev) => {
      if (prev === teacherId) return null;
      else return teacherId;
    });
  };

  const columnHelper = createColumnHelper<TeachersType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => getTeacherFullname(row), {
        id: "name",
        header: "ПІБ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "category.shortName",
        header: "ЦК",
        cell: ({ row }) => {
          return (
            <Tooltip delayDuration={500}>
              <TooltipTrigger>{row.original.category.shortName}</TooltipTrigger>
              <TooltipContent>ЦК {row.original.category.name}</TooltipContent>
            </Tooltip>
          );
        },
      }),
    ],
    [teachers],
  );

  const table = useReactTable({
    data: filtredTeachers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    globalFilterFn: "fuzzy",
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {!teachers.length ? (
        <div className="font-mono py-20 text-center">Пусто</div>
      ) : (
        <div className="block max-w-full">
          <Table className="w-full ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-white">
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(index === 1 ? "!text-right" : "text-left", "cursor-pointer select-none")}
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
              {table.getRowModel().rows.map((row) => {
                const isSelected = selectedTeacherId === row.original.id;
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => handleSelectTeacher(row.original.id)}
                    className={cn("hover:bg-border/40", isSelected ? "!text-primary !bg-primary-light" : "")}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "py-1 cursor-pointer",
                            row.getVisibleCells().length === index + 1 ? "text-right" : "text-left",
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

          <div className="flex items-center justify-between mt-4 pl-1">
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
      )}
    </>
  );
};
