import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, InfoIcon } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/common/avatar";
import { fuzzyFilter } from "~/helpers/fuzzy-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";
import { cn } from "~/lib/utils";

const data = [
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
  {
    name: "",
    email: "",
    roles: ["admin", "teacher"],
    lastLogin: "10 днів тому",
  },
];

const AccountsTab = () => {
  const [globalSearch, setGlobalSearch] = useState("");

  const columnHelper = createColumnHelper<(typeof data)[number]>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "avatar_name_email",
        header: "ПІБ",
        cell: ({ row }) => {
          let isStatusActive = true;
          // if (row.original.status === "Архів") isStatusActive = false;
          return (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Пташник Роман Вікторович</p>
                <p className="text-muted-foreground">ptashnyk.roman@pharm.zt.ua</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.roles.join(", "), {
        id: "studentsCount",
        header: "Ролі",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastLogin", { header: "Останній вхід" }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => {
          return (
            <div>
              111
              {/* <GroupActions id={row.original.id} /> */}
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: data,
    columns,
    // state: { sorting, globalFilter: globalSearch },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
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
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((groupData, index) => {
            const group = groupData.original;
            return (
              <TableRow key={index} className="hover:bg-border/40">
                <TableCell className={cn("truncate max-w-[30px]", "text-left px-2 py-1")}>{index + 1}</TableCell>

                {groupData.getVisibleCells().map((cell, index) => {
                  const isActionsCol = index === groupData.getVisibleCells().length - 1;
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
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export { AccountsTab };
