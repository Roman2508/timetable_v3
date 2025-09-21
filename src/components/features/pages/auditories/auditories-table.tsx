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
import AuditoriesActions from "./auditories-action"
import { Badge } from "@/components/ui/common/badge"
import { generalSelector } from "@/store/general/general-slice"
import { AUDITORY_SORT_KEY, AUDITORY_SORT_TYPE } from "@/constants/cookies-keys"
import type { AuditoriesTypes } from "@/store/auditories/auditories-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table"
import { fuzzyFilter } from "@/helpers/fuzzy-filter"

interface IAuditoriesTableProps {
  globalSearch: string
  auditories: AuditoriesTypes[]
  setGlobalSearch: React.Dispatch<React.SetStateAction<string>>
}

export const AuditoriesTable: React.FC<IAuditoriesTableProps> = ({ auditories, globalSearch, setGlobalSearch }) => {
  const [_, setCookie] = useCookies()

  const {
    auditories: { isOrderDesc, orderField },
  } = useSelector(generalSelector)

  const [sorting, setSorting] = React.useState<SortingState>(orderField ? [{ id: orderField, desc: isOrderDesc }] : [])

  const columnHelper = createColumnHelper<AuditoriesTypes>()
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", { header: "Аудиторія" }),
      columnHelper.accessor((row) => row.category?.name ?? "", {
        id: "category",
        header: "Підрозділ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("seatsNumber", { header: "Кількість місць" }),
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
        cell: ({ row }) => <AuditoriesActions id={row.original.id} />,
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: auditories,
    columns,
    state: { sorting, globalFilter: globalSearch },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
  })

  React.useEffect(() => {
    if (sorting.length) {
      setCookie(AUDITORY_SORT_KEY, sorting[0].id)
      setCookie(AUDITORY_SORT_TYPE, sorting[0].desc)
    } else {
      setCookie(AUDITORY_SORT_KEY, "")
      setCookie(AUDITORY_SORT_TYPE, false)
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
                      className={cn(index !== 4 ? "cursor-pointer select-none text-left" : "text-right")}
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
