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
} from "@tanstack/react-table"
import { useSelector } from "react-redux"
import { useCallback, useMemo, useState, type Dispatch, type FC, type SetStateAction } from "react"
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/common/input"
import { fuzzyFilter } from "@/helpers/fuzzy-filter"
import { Button } from "@/components/ui/common/button"
import { plansSelector } from "@/store/plans/plans-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/select"
import { groupLessonsByName, type PlanItemType, type SemesterHoursType } from "@/helpers/group-lessons-by-name"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/common/pagination"

const defaultSemesterData = {
  id: 0,
  lectures: 0,
  practical: 0,
  laboratory: 0,
  seminars: 0,
  exams: 0,
  examsConsulation: 0,
  metodologicalGuidance: 0,
  independentWork: 0,
  totalHours: 0,
}

interface IFullPlanTableProps {
  globalSearch: string
  setGlobalSearch: Dispatch<SetStateAction<string>>
  setIsHoursModalOpen: Dispatch<SetStateAction<boolean>>
  setIsDetailsModalOpen: Dispatch<SetStateAction<boolean>>
  setSelectedSemesterHours: Dispatch<SetStateAction<SemesterHoursType | null>>
}

export const FullPlanTable: FC<IFullPlanTableProps> = ({
  globalSearch,
  setGlobalSearch,
  setIsHoursModalOpen,
  setIsDetailsModalOpen,
  setSelectedSemesterHours,
}) => {
  const { planSubjects } = useSelector(plansSelector)

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

  const data = useMemo(() => groupLessonsByName(planSubjects ?? []), [planSubjects])

  const columnHelper = createColumnHelper<PlanItemType>()
  const columns = useMemo<ColumnDef<PlanItemType, string>[]>(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: "name",
        header: "Дисципліна",
        cell: (info) => info.getValue(),
        // enableSorting: true,
        // enableGlobalFilter: true,
        // rowSpan: 3,
      }),

      columnHelper.accessor((row) => row.cmk.shortName, {
        id: "cmk",
        header: "ЦК",
        cell: (info) => info.getValue(),
        // enableSorting: true,
        // enableGlobalFilter: true,
        // rowSpan: 3,
      }),

      columnHelper.accessor((row) => String(row.totalHours), {
        id: "totalHours",
        header: "Всього год.",
        cell: (info) => info.getValue(),
        // enableSorting: true,
        // enableGlobalFilter: true,
        // rowSpan: 3,
      }),

      {
        header: "Розподіл за курсами та семестрами",
        rowSpan: 1,
        columns: [
          {
            accessorKey: "course_1",
            header: () => "1 курс",
            rowSpan: 1,
            columns: [
              {
                rowSpan: 1,
                id: "semester_1",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_1 ? row.semester_1.totalHours : ""),
                header: () => <span>Семестр 1</span>,
              },
              {
                rowSpan: 1,
                id: "semester_2",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_2 ? row.semester_2.totalHours : ""),
                header: () => <span>Семестр 2</span>,
              },
            ],
          },
          {
            accessorKey: "course_2",
            header: () => "2 курс",
            rowSpan: 1,
            columns: [
              {
                rowSpan: 1,
                id: "semester_3",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_3 ? row.semester_3.totalHours : ""),
                header: () => <span>Семестр 3</span>,
              },
              {
                rowSpan: 1,
                id: "semester_4",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_4 ? row.semester_4.totalHours : ""),
                header: () => <span>Семестр 4</span>,
              },
            ],
          },
          {
            accessorKey: "progress",
            header: "3 курс",
            rowSpan: 1,
            columns: [
              {
                rowSpan: 1,
                id: "semester_5",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_5 ? row.semester_5.totalHours : ""),
                header: () => <span>Семестр 5</span>,
              },
              {
                rowSpan: 1,
                id: "semester_6",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_6 ? row.semester_6.totalHours : ""),
                header: () => <span>Семестр 6</span>,
              },
            ],
          },
          {
            accessorKey: "progress",
            header: "4 курс",
            rowSpan: 1,

            columns: [
              {
                rowSpan: 1,
                id: "semester_7",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_7 ? row.semester_7.totalHours : ""),
                header: () => <span>Семестр 7</span>,
              },
              {
                rowSpan: 1,
                id: "semester_8",
                cell: (info) => info.getValue(),
                accessorFn: (row) => (row.semester_8 ? row.semester_8.totalHours : ""),
                header: () => <span>Семестр 8</span>,
              },
            ],
          },
        ],
      },
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: globalSearch, pagination },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    globalFilterFn: "auto",
    onPaginationChange: setPagination,
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleSelectLesson = useCallback((key: string, planItem: PlanItemType) => {
    const cellData = planItem[key as keyof PlanItemType]
    const isCellSemester = key.includes("semester_")
    const isClickDisabled = key === "totalHours"

    if (isClickDisabled) return

    if (isCellSemester && cellData !== null) {
      setSelectedSemesterHours(cellData as SemesterHoursType)
      setIsHoursModalOpen(true)
      return
    }

    const semesterNumber = Number(key.slice(key.length - 1))
    setSelectedSemesterHours({ ...defaultSemesterData, name: planItem.name, semesterNumber, cmk: planItem.cmk })
    if (isCellSemester) {
      setIsHoursModalOpen(true)
      return
    }

    setIsDetailsModalOpen(true)
  }, [])

  return (
    <>
      <Table className="w-full border-b">
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
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {!planSubjects?.length ? (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={11} className="text-center py-10 font-mono">
                Пусто
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="hover:bg-border/40">
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell
                        key={cell.id}
                        onClick={() => handleSelectLesson(cell.column.id, row.original)}
                        className={cn(
                          index < 2 ? "" : "text-center",
                          "hover:bg-border/50 cursor-pointer",
                          index === 2 ? "!cursor-default hover:!bg-border/0" : "",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center my-10 gap-8">
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
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
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
    </>
  )
}
