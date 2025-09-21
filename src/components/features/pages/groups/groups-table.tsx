import React from "react"

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table"
import { useCookies } from "react-cookie"
import { useSelector } from "react-redux"
import { ArrowDown, ArrowUp } from "lucide-react"
import { rankItem } from "@tanstack/match-sorter-utils"

import { cn } from "@/lib/utils"
import GroupActions from "./group-actions"
import { Badge } from "@/components/ui/common/badge"
import { generalSelector } from "@/store/general/general-slice"
import type { GroupsShortType } from "@/store/groups/groups-types"
import { GROUP_SORT_KEY, GROUP_SORT_TYPE } from "@/constants/cookies-keys"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table"
import { fuzzyFilter } from "@/helpers/fuzzy-filter"

interface IGroupsTableProps {
  globalSearch: string
  groups: GroupsShortType[]
  setGlobalSearch: React.Dispatch<React.SetStateAction<string>>
}

export const GroupsTable: React.FC<IGroupsTableProps> = ({ groups, globalSearch, setGlobalSearch }) => {
  const [_, setCookie] = useCookies()

  const {
    groups: { isOrderDesc, orderField },
  } = useSelector(generalSelector)

  const [sorting, setSorting] = React.useState<SortingState>(orderField ? [{ id: orderField, desc: isOrderDesc }] : [])

  const columnHelper = createColumnHelper<GroupsShortType>()
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", { header: "Група" }),
      columnHelper.accessor((row) => row.category?.name ?? "", {
        id: "category",
        header: "Підрозділ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("courseNumber", { header: "Курс" }),
      columnHelper.accessor((row) => (row.students || []).length, {
        id: "studentsCount",
        header: "Студентів",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("formOfEducation", { header: "Форма навчання" }),
      columnHelper.display({
        id: "status",
        header: "Статус",
        cell: ({ row }) => {
          let isStatusActive = true
          if (row.original.status === "Архів") isStatusActive = false
          return (
            <Badge
              variant="outline"
              className={cn(
                "border-0",
                isStatusActive ? "text-success bg-success-background" : "text-error bg-error-background",
              )}
            >
              {row.original.status}
            </Badge>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => {
          return <GroupActions id={row.original.id} />
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: groups,
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

  React.useEffect(() => {
    if (sorting.length) {
      setCookie(GROUP_SORT_KEY, sorting[0].id)
      setCookie(GROUP_SORT_TYPE, sorting[0].desc)
    } else {
      setCookie(GROUP_SORT_KEY, "")
      setCookie(GROUP_SORT_TYPE, false)
    }
  }, [sorting])

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
                      className={cn(index !== 6 ? "cursor-pointer select-none text-left" : "text-right")}
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
                      "text-left px-2 py-1",
                      isActionsCol ? "!text-right" : "",
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
  )
}
