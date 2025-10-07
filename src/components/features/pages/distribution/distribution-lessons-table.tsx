import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table"
import { useSelector } from "react-redux"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo, type Dispatch, type FC, type SetStateAction, useEffect } from "react"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { fuzzyFilter } from "@/helpers/fuzzy-filter"
import { Button } from "@/components/ui/common/button"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { useItemsBySemesters } from "@/hooks/use-items-by-semesters"
import type { GroupLoadType, GroupsShortType } from "@/store/groups/groups-types"
import { getGroupLoadByCurrentCourse } from "@/store/schedule-lessons/schedule-lessons-async-actions"
import { clearGroupLoad, scheduleLessonsSelector } from "@/store/schedule-lessons/schedule-lessons-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/select"
import { groupLessonsforDistribution, type DistributionLessonType } from "@/helpers/get-lesson-for-distribution"
import { Pagination, PaginationItem, PaginationLink, PaginationContent } from "@/components/ui/common/pagination"

interface IDistributionLessonsTableProps {
  globalFilter: string
  selectedGroup: GroupsShortType | null
  selectedLesson: DistributionLessonType | null
  setGlobalFilter: Dispatch<SetStateAction<string>>
  selectedSemesters: { id: number; name: string }[]
  setSelectedLesson: Dispatch<SetStateAction<DistributionLessonType | null>>
  setSelectedSemesters: Dispatch<SetStateAction<{ id: number; name: string }[]>>
  setAvailableSemesters: Dispatch<SetStateAction<{ id: number; name: string }[]>>
}

export const DistributionLessonsTable: FC<IDistributionLessonsTableProps> = ({
  globalFilter,
  selectedGroup,
  selectedLesson,
  setGlobalFilter,
  setSelectedLesson,
  selectedSemesters,
  setSelectedSemesters,
  setAvailableSemesters,
}) => {
  const dispatch = useAppDispatch()

  const { groupLoad } = useSelector(scheduleLessonsSelector)

  const groupedLoad = useMemo(() => groupLessonsforDistribution(groupLoad), [groupLoad])
  const filtredLoad = useItemsBySemesters(groupedLoad, selectedSemesters)

  const [sorting, setSorting] = useState<SortingState>([])
  const [isLessonsLoading, setIsLessonsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

  const columnHelper = createColumnHelper<DistributionLessonType>()
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Дисципліна" }),
      columnHelper.accessor("semester", { header: "Семестр" }),
    ],
    [],
  )

  const table = useReactTable({
    columns,
    data: filtredLoad,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, pagination, globalFilter },

    globalFilterFn: "fuzzy",
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedGroup?.id) {
          setIsLessonsLoading(true)
          const { payload } = await dispatch(getGroupLoadByCurrentCourse(selectedGroup.id))

          const allSemesters = (payload as GroupLoadType[]).map((el) => el.semester)
          const uniqueSemesters = [...new Set(allSemesters)]
          const availableSemesters = uniqueSemesters.map((semester) => ({ id: semester, name: String(semester) }))
          setSelectedSemesters(availableSemesters)
          setAvailableSemesters(availableSemesters)
        }
      } finally {
        setIsLessonsLoading(false)
      }
    }

    fetchData()

    return () => {
      dispatch(clearGroupLoad())
    }
  }, [selectedGroup])

  if (!selectedGroup || !groupedLoad.length) {
    return <p className="font-mono text-center py-10">Пусто</p>
  }

  if (isLessonsLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className="block max-w-full">
        <Table className="w-full overflow-hidden">
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isNameSame = row.original.name === selectedLesson?.name
              const isSemesterSame = row.original.semester === selectedLesson?.semester

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-border/40 cursor-pointer",
                    isNameSame && isSemesterSame ? "!text-primary !bg-primary-light" : "",
                  )}
                  onClick={() => setSelectedLesson(row.original)}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-0 py-1",
                          index === 1 ? "text-right" : "",
                          index === 0 ? "truncate max-w-[200px]" : "",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
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
  )
}
