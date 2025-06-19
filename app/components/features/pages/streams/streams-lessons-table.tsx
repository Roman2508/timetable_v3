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
import { Checkbox } from "~/components/ui/common/checkbox";
import { useEffect, useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "~/lib/utils";
import { makeData } from "./make-data";
import { useAppDispatch } from "~/store/store";
import { Input } from "~/components/ui/common/input";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Button } from "~/components/ui/common/button";
import type { StreamsType } from "~/store/streams/streams-types";
import { getStreamLessons } from "~/store/streams/streams-async-actions";
import { clearStreamLessons, streamsSelector } from "~/store/streams/streams-slice";
import { groupLessonsByStreams, type StreamLessonType } from "~/helpers/group-lessons-by-streams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";

const checkIsLessonsSame = (obj1: StreamLessonType, obj2: StreamLessonType) => {
  const sharedKeys = Object.keys(obj1).filter((key) => key in obj2);
  return sharedKeys.every((key) => obj1[key as keyof StreamLessonType] === obj2[key as keyof StreamLessonType]);
};

interface IStreamLessonsTableProps {
  selectedStream: StreamsType | null;
  selectedLessons: StreamLessonType[];
  setSelectedLessons: Dispatch<SetStateAction<StreamLessonType[]>>;
}

export const StreamsLessonsTable: FC<IStreamLessonsTableProps> = ({
  selectedStream,
  selectedLessons,
  setSelectedLessons,
}) => {
  const dispatch = useAppDispatch();

  const { streamLessons } = useSelector(streamsSelector);

  const lessons = useMemo(() => groupLessonsByStreams(streamLessons ?? []), [streamLessons]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState(() => makeData(1000));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const handleSelectedLesson = (lesson: StreamLessonType) => {
    setSelectedLessons((prev) => {
      const existedLesson = prev.find((el) => checkIsLessonsSame(lesson, el));
      if (existedLesson) {
        return prev.filter((el) => !checkIsLessonsSame(lesson, el));
      }
      return [...prev, lesson];
    });
  };

  const checkIsActive = (lesson: StreamLessonType) => {
    return selectedLessons.some((el) => checkIsLessonsSame(lesson, el));
  };

  const columnHelper = createColumnHelper<StreamLessonType>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Checkbox
            checked={checkIsActive(row.original)}
            onClick={() => handleSelectedLesson(row.original)}
            // onChange={() => handleSelectedLesson(row.original)}
          />
        ),
      }),
      columnHelper.accessor("name", { header: "Дисципліна" }),
      columnHelper.accessor((row) => row.group.name, { id: "group", header: "Група", cell: (info) => info.getValue() }),
      columnHelper.accessor("semester", { header: "Семестр" }),
      columnHelper.accessor("lectures", { header: "Лекції" }),
      columnHelper.accessor("practical", { header: "Практичні" }),
      columnHelper.accessor("laboratory", { header: "Лабораторні" }),
      columnHelper.accessor("seminars", { header: "Семінари" }),
      columnHelper.accessor("exams", { header: "Екзамени" }),
    ],
    [selectedLessons],
  );

  const table = useReactTable({
    data: lessons,
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

  useEffect(() => {
    if (!selectedStream) return;
    dispatch(clearStreamLessons());
    const fetchGroups = async () => {
      Promise.allSettled(
        selectedStream.groups.map(async (el) => {
          await dispatch(getStreamLessons(el.id));
        }),
      );
    };
    fetchGroups();
  }, [selectedStream]);

  return (
    <>
      {!lessons.length ? (
        <div className="font-mono py-20 text-center">Пусто</div>
      ) : (
        <div className="p-2 block max-w-full">
          <Table className="w-full ">
            {/* <TableHeader>
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
            </TableHeader> */}

            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-white">
                  {headerGroup.headers.map((header, index) => {
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
                      checkIsActive(row.original) ? "text-primary bg-primary-light hover:bg-primary-light" : "",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className={cn("text-left")}>
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
      )}
    </>
  );
};
