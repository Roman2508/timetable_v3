import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table"
import { useSelector } from "react-redux"
import { ArrowDown, ArrowUp, Pencil } from "lucide-react"
import { useState, useMemo, type Dispatch, type SetStateAction, type FC } from "react"

import { cn } from "@/lib/utils"
import { fuzzyFilter } from "@/helpers/fuzzy-filter"
import { Button } from "@/components/ui/common/button"
import { teacherProfileSelector } from "@/store/teacher-profile/teacher-profile-slice"
import type { IndividualWorkPlanType } from "@/store/teacher-profile/teacher-profile-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table"
import { LoadingStatusTypes } from "@/store/app-types"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"

interface Props {
  globalSearch: string
  setIsOpenModal: Dispatch<SetStateAction<boolean>>
  setGlobalSearch: Dispatch<SetStateAction<string>>
  setEditedWork: Dispatch<SetStateAction<IndividualWorkPlanType | null>>
}

export const TeacherActivitiesTypesTable: FC<Props> = ({
  globalSearch,
  setEditedWork,
  setIsOpenModal,
  setGlobalSearch,
}) => {
  const { individualWorkPlan, loadingStatus } = useSelector(teacherProfileSelector)

  const [sorting, setSorting] = useState<SortingState>([])

  const columnHelper = createColumnHelper<IndividualWorkPlanType>()
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Назва" }),
      columnHelper.accessor("hours", { header: "К-сть годин" }),
      columnHelper.accessor("type", { header: "Тип діяльності" }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            onClick={() => {
              setEditedWork(row.original)
              setIsOpenModal(true)
            }}
          >
            <Pencil />
          </Button>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: individualWorkPlan || [],
    columns,
    state: { sorting, globalFilter: globalSearch },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: "auto",
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <Table className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-white">
            <TableHead className="!text-left font-mono">
              <div className="cursor-pointer select-none text-left">
                <p className="inline-flex relative uppercase font-mono">№</p>
              </div>
            </TableHead>

            {headerGroup.headers.map((header, index) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        index !== 0 ? "w-[75%]" : "",
                        index !== 1 ? "w-[5%]" : "",
                        index !== 2 ? "w-[10%]" : "",
                        index !== 3 ? "cursor-pointer select-none text-left" : "w-[100%] pr-2 !text-right",
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
        {loadingStatus === LoadingStatusTypes.LOADING && !individualWorkPlan ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24">
              <div className="flex justify-center pt-10">
                <LoadingSpinner />
              </div>
            </TableCell>
          </TableRow>
        ) : null}

        {loadingStatus !== LoadingStatusTypes.LOADING && individualWorkPlan && !individualWorkPlan?.length ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24">
              <div className="flex justify-center py-10">
                <p className="text-md font-mono">Нічого не знайдено</p>
              </div>
            </TableCell>
          </TableRow>
        ) : null}

        {table.getRowModel().rows.map((groupData, index) => {
          const group = groupData.original
          return (
            <TableRow key={group.id} className="hover:bg-border/40">
              <TableCell className={cn("truncate max-w-[30px]", "text-left px-2 py-1")}>{index + 1}</TableCell>

              {groupData.getVisibleCells().map((cell, index) => {
                const isActionsCol = index === groupData.getVisibleCells().length - 1
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "text-left px-2 py-0",
                      isActionsCol ? "!text-right" : "",
                      index === 0 ? "truncate max-w-[700px]" : "",
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
  )
}
