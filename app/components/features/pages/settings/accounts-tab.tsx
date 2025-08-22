import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { ArrowDown, ArrowUp, InfoIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import AccountsModal from "./accounts-modal"
import AccountsActions from "./accounts-actions"
import { fuzzyFilter } from "~/helpers/fuzzy-filter"
import { authSelector } from "~/store/auth/auth-slice"
import type { UserType } from "~/store/auth/auth-types"
import { formatLastLogin } from "~/helpers/format-last-login"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/common/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table"

const AccountsTab = () => {
  const { users } = useSelector(authSelector)

  const [globalSearch, setGlobalSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editedUser, setEditedUser] = useState<UserType | null>(null)
  const [modalType, setModalType] = useState<"create" | "update">("create")

  const onEditUser = (id: number) => {
    if (!users) return
    const editedUser = users.find((el) => el.id === id)
    if (!editedUser) return
    setEditedUser(editedUser)
    setIsModalOpen(true)
    setModalType("update")
  }

  const columnHelper = createColumnHelper<UserType>()
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "avatar_name_email",
        header: "ПІБ",
        cell: ({ row }) => {
          let isStatusActive = true
          // if (row.original.status === "Архів") isStatusActive = false;
          return (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={row.original.picture ? row.original.picture : "https://github.com/shadcn.png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{row.original.name ? row.original.name : "-"}</p>
                <p className="text-muted-foreground">{row.original.email}</p>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor((row) => (row.roles ? row.roles.map((el) => el.name).join(", ") : "-"), {
        id: "studentsCount",
        header: "Ролі",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => formatLastLogin(row.lastLogin), {
        id: "lastLogin",
        header: "Останній вхід",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => {
          return <AccountsActions id={row.original.id} onEditUser={onEditUser} />
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    columns,
    data: users || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <AccountsModal user={editedUser} isOpen={isModalOpen} modalType={modalType} setIsOpen={setIsModalOpen} />

      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <InfoIcon className="w-5" /> Загальна інформація
      </h2>

      <div className="my-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Загальна інформація
        </h2>

        <p className="text-muted-foreground mb-6">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>
      </div>

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
                        className={cn(index !== 3 ? "cursor-pointer select-none text-left" : "text-right")}
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
              <TableRow key={index} className="hover:bg-border/40">
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
    </>
  )
}

export { AccountsTab }
