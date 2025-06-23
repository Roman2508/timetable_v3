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
import { FiSearch as SearchIcon } from "react-icons/fi";
import { useEffect, useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Button } from "~/components/ui/common/button";
import { Checkbox } from "~/components/ui/common/checkbox";
import { getStreamLessons } from "~/store/streams/streams-async-actions";
import { clearStreamLessons, streamsSelector } from "~/store/streams/streams-slice";
import { groupLessonsByStreams, type StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";
import { teachersSelector } from "~/store/teachers/teachers-slice";
import type { TeachersType } from "~/store/teachers/teachers-types";
import { getTeacherFullname } from "~/helpers/get-teacher-fullname";

interface IDistributionTeacherTableProps {
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}

export const DistributionTeacherTable: FC<IDistributionTeacherTableProps> = ({ globalFilter, setGlobalFilter }) => {
  const dispatch = useAppDispatch();

  const { teachersCategories } = useSelector(teachersSelector);

  const teachers = useMemo(() => (teachersCategories ?? []).flatMap((el) => el.teachers), [teachersCategories]);
  //   const filtredLessons = useItemsBySemesters(lessons, selectedSemester);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const handleSelectedLesson = (lesson: StreamLessonType) => {
    // setSelectedLessons((prev) => {
    //   const existedLesson = prev.find((el) => checkIsLessonsSame(lesson, el));
    //   if (existedLesson) {
    //     return prev.filter((el) => !checkIsLessonsSame(lesson, el));
    //   }
    //   return [...prev, lesson];
    // });
  };

  console.log(teachers);

  const checkIsActive = (lesson: StreamLessonType) => {
    // return selectedLessons.some((el) => checkIsLessonsSame(lesson, el));
  };

  const columnHelper = createColumnHelper<TeachersType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => getTeacherFullname(row), {
        id: "name",
        header: "ПІБ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category.name", { header: "ЦК" }),
    ],
    [teachers],
  );

  /* 
                    <Tooltip delayDuration={500}>
                      <TooltipTrigger>
                        <TabsTrigger key={el.name} value={el.name} className="px-3 py-2">
                          {el.icon}
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>{el.tooltip}</TooltipContent>
                    </Tooltip>

  */

  const table = useReactTable({
    data: teachers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
  });

  //   useEffect(() => {
  //     if (!selectedStream) return;
  //     dispatch(clearStreamLessons());
  //     const fetchGroups = async () => {
  //       Promise.allSettled(
  //         selectedStream.groups.map(async (el) => {
  //           await dispatch(getStreamLessons(el.id));
  //         }),
  //       );
  //     };
  //     fetchGroups();
  //   }, [selectedStream]);

  return (
    <>
      {!teachers.length ? (
        <div className="font-mono py-20 text-center">Пусто</div>
      ) : (
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
                            className={cn("cursor-pointer select-none text-left")}
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
                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "hover:bg-border/40",
                      //   checkIsActive(row.original) ? "text-primary bg-primary-light hover:bg-primary-light" : "",
                    )}
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

          <div className="flex items-center justify-center my-8 gap-8">
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
