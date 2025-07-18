import { useMemo, useState } from "react";
import { InfoIcon, ScanEyeIcon, ArrowDown, ArrowUp, Lock } from "lucide-react";

import { Switch } from "~/components/ui/common/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

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

const tableData = [
  {
    name: "Головний адміністратор",
    users: 1,
    isReserved: true,
  },
  {
    name: "Адміністратор",
    users: 4,
    isReserved: true,
  },
  {
    name: "Викладач",
    users: 46,
    isReserved: true,
  },
  {
    name: "Студент",
    users: 512,
    isReserved: true,
  },
  {
    name: "Методист",
    users: 1,
    isReserved: true,
  },
  {
    name: "Гість",
    users: 2,
    isReserved: false,
  },
];

const RolesTab = () => {
  const defaultItems = [
    {
      id: "groups",
      title: "Групи",
      description: "Receive emails about your account security.",
      checked: false,
    },
    {
      id: "streams",
      title: "Потоки",
      description: "Receive emails about your account security.",
      checked: false,
    },
    {
      id: "auditories",
      title: "Аудиторії",
      description: "Receive emails about your account security.",
      checked: true,
    },
  ];

  const [items, setItems] = useState(defaultItems);

  const [globalSearch, setGlobalSearch] = useState("");

  const columnHelper = createColumnHelper<(typeof tableData)[number]>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: "Назва",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {row.original.name}
              {row.original.isReserved && <Lock size={14} />}
            </div>
          );
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
    data: tableData,
    columns,
    // state: { sorting, globalFilter: globalSearch },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    globalFilterFn: "auto",
    filterFns: { fuzzy: fuzzyFilter },
    onGlobalFilterChange: setGlobalSearch,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <ScanEyeIcon className="w-5" /> Ролі
      </h2>

      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Ролі
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
                        "text-left px-2 py-2",
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

      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <InfoIcon className="w-5" /> Ролі
        </h2>

        <p className="text-muted-foreground">
          Тут відображається пароль від вашого облікового запису. <br />
          Якщо у вас виникли проблеми зі входом або ви хочете змінити свої облікові дані - зверніться до системного
          адміністратора
        </p>
      </div>

      {[...Array(3)].map((_, index) => (
        <div className="my-10" key={index}>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <InfoIcon className="w-5" /> Структура
          </h2>

          {items.map((el) => (
            <div className="border p-3 mb-3 border p-3 mb-3">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold">{el.title}</div>
                  <div className="text-sm text-muted-foreground">{el.description}</div>
                </div>

                <Switch
                  checked={el.checked}
                  onCheckedChange={(checked) =>
                    setItems((prev) => {
                      return prev.map((p) => {
                        if (p.id === el.id) {
                          return { ...p, checked };
                        }
                        return p;
                      });
                    })
                  }
                />
              </div>

              <Collapsible>
                <CollapsibleTrigger className="text-sm underline cursor-pointer">Деталі</CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2">
                    <li className="flex items-center gap-2 mb-2">
                      <Switch checked={el.checked} onCheckedChange={() => {}} />
                      <label htmlFor="" className="text-sm">
                        Перегляд
                      </label>
                    </li>

                    <li className="flex items-center gap-2">
                      <Switch checked={el.checked} onCheckedChange={() => {}} />
                      <label htmlFor="" className="text-sm">
                        Редагування
                      </label>
                    </li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default RolesTab;
