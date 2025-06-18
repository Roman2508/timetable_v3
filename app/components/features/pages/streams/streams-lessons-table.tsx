import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState, type FC } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { makeData, type Person } from "./make-data";
import { Input } from "~/components/ui/common/input";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Button } from "~/components/ui/common/button";
import type { StreamsType } from "~/store/streams/streams-types";
import { getStreamLessons } from "~/store/streams/streams-async-actions";
import { groupLessonsByFields } from "~/helpers/group-lessons-by-fields";
import { clearStreamLessons, streamsSelector } from "~/store/streams/streams-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/common/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "~/components/ui/common/pagination";

interface IStreamLessonsTableProps {
  selectedStream: StreamsType | null;
}

export const StreamsLessonsTable: FC<IStreamLessonsTableProps> = ({ selectedStream }) => {
  const dispatch = useAppDispatch();

  const { streamLessons } = useSelector(streamsSelector);

  const lessons = useMemo(
    () =>
      groupLessonsByFields(streamLessons ?? [], { groupName: true, lessonName: true, semester: true, subgroups: true }),
    [streamLessons],
  );

  console.log("stream lessons:", lessons);

  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState(() => makeData(1000));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const columnHelper = createColumnHelper<any>();

  // const columns2 = useMemo(
  //   () => [
  //     columnHelper.accessor("name", { header: "Дисципліна" }),
  //     columnHelper.accessor("group", { header: "Група" }),
  //     columnHelper.accessor("semester", { header: "Семестр" }),
  //     columnHelper.accessor((row) => row.category?.name ?? "", {
  //       id: "category",
  //       header: "Підрозділ",
  //       cell: (info) => info.getValue(),
  //     }),

  //     columnHelper.accessor("courseNumber", { header: "Курс" }),
  //     columnHelper.accessor((row) => row.students.length, {
  //       id: "studentsCount",
  //       header: "Студентів",
  //       cell: (info) => info.getValue(),
  //     }),
  //     columnHelper.accessor("formOfEducation", { header: "Форма навчання" }),
  //     columnHelper.display({
  //       id: "status",
  //       header: "Статус",
  //       cell: ({ row }) => {
  //         let isStatusActive = true;
  //         if (row.original.status === "Архів") isStatusActive = false;
  //         return (
  //           <Badge
  //             variant="outline"
  //             className={cn(
  //               "border-0",
  //               isStatusActive ? "text-success bg-success-background" : "text-error bg-error-background",
  //             )}
  //           >
  //             {row.original.status}
  //           </Badge>
  //         );
  //       },
  //     }),
  //     columnHelper.display({
  //       id: "actions",
  //       header: "Дії",
  //       cell: ({ row }) => {
  //         return <GroupActions id={row.original.id} />;
  //       },
  //     }),
  //   ],
  //   [],
  // );

  const columns = useMemo<ColumnDef<Person>[]>(
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

  /* 
    id: 2,
    name: "Ділова іноземна мова (B2)",
    semester: 1,
    specialization: null,
    typeRu: "ПЗ",
    typeEn: "practical",
    hours: 36,
    subgroupNumber: null,
    stream: null,
    teacher: null,

    
    group: {id: 2, name: 'LD9-25-1'}
    hours: 30
    id: 20
    name: "Фармакологія"
    planSubjectId: {id: 1}
    semester: 1
    specialization: null
    stream: null
    subgroupNumber: null
    teacher: null
    typeEn: "practical"
    typeRu: "ПЗ"
  */

  const table = useReactTable({
    data,
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

          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="hover:bg-border/40">
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell key={cell.id} className={cn(index === 0 ? "" : "text-center", "")}>
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
