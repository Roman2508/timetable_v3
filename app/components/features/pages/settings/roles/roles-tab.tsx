import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table"
import { useSelector } from "react-redux"
import { useMemo, useState } from "react"
import { InfoIcon, ScanEyeIcon, ArrowDown, ArrowUp, Lock, Plus } from "lucide-react"

import { cn } from "~/lib/utils"
import RolesModal from "./roles-modal"
import Permissions from "./permissions"
import RolesActions from "./roles-actions"
import { fuzzyFilter } from "~/helpers/fuzzy-filter"
import type { RoleType } from "~/store/roles/roles-types"
import { rolesSelector } from "~/store/roles/roles-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table"

const RolesTab = () => {
  const { roles } = useSelector(rolesSelector)

  const [globalSearch, setGlobalSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editedRole, setEditedRole] = useState<RoleType | null>(null)
  const [modalType, setModalType] = useState<"create" | "update">("create")

  const onCreateRole = () => {
    setEditedRole(null)
    setModalType("create")
    setIsModalOpen(true)
  }

  const onUpdateRole = (id: number) => {
    if (!roles) return
    const role = roles.find((el) => el.id === id)
    if (!role) return
    setEditedRole(role)
    setModalType("update")
    setIsModalOpen(true)
  }

  const columnHelper = createColumnHelper<RoleType>()
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: "Назва",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {row.original.name}
              {row.original.key === "root_admin" && <Lock size={14} />}
            </div>
          )
        },
      }),
      columnHelper.accessor((row) => row.users, {
        id: "studentsCount",
        header: "Користувачів",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => {
          return <RolesActions id={row.original.id} roleKey={row.original.key} onEditUser={onUpdateRole} />
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: roles || [],
    columns,
    state: { globalFilter: globalSearch },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    globalFilterFn: "auto",
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <>
      <RolesModal
        isOpen={isModalOpen}
        modalType={modalType}
        editedRole={editedRole}
        setIsOpen={setIsModalOpen}
        setEditedRole={setEditedRole}
      />

      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <ScanEyeIcon className="w-5" /> Ролі
      </h2>

      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Список ролей
        </h2>

        <p className="text-muted-foreground">
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
                        className={cn(index !== 2 ? "cursor-pointer select-none text-left" : "text-right")}
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
                        "text-left px-2 py-0",
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

      <button
        onClick={onCreateRole}
        className="flex justify-center items-center gap-1 w-full text-sm border border-border border-dashed py-2 mt-2 cursor-pointer hover:bg-border/20 transition-colors"
      >
        <Plus size={18} />
        Додати нову роль
      </button>

      <Permissions />
    </>
  )
}

export default RolesTab
