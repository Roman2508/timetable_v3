import React from "react";

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "~/lib/utils";
import { makeData, type Person } from "./make-data";
import { Badge } from "~/components/ui/common/badge";
import { ActionsDropdown } from "../../actions-dropdown";
import type { GroupsShortType } from "~/store/groups/groups-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/common/table";

interface IGroupsTableProps {
  groups: GroupsShortType[];
}

export const GroupsTable: React.FC<IGroupsTableProps> = ({ groups }) => {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<GroupsShortType>[]>(
    () => [
      { accessorKey: "name", header: "Група", footer: (props) => props.column.id },
      { accessorKey: "category", header: "Підрозділ", footer: (props) => props.column.id },
      { accessorKey: "course", header: "Курс", footer: (props) => props.column.id },
      { accessorKey: "students", header: "Студентів", footer: (props) => props.column.id, rowSpan: 3 },
      { accessorKey: "formOfEducation", header: "Форма навчання", footer: (props) => props.column.id, rowSpan: 3 },
      { accessorKey: "status", header: "Статус", footer: (props) => props.column.id, rowSpan: 3 },
      { header: "Дії", footer: (props) => props.column.id, rowSpan: 3 },
    ],
    [],
  );

  // const groupsData = React.useMemo(() => {
  //  return groups.map((group) => ({
  //   id: group.id,
  //   name: group.name,
  //   courseNumber: group.courseNumber,
  //   yearOfAdmission: group.yearOfAdmission,
  //   formOfEducation: group.formOfEducation,
  //   isHide: group.isHide,
  //   status: group.status,
  //   categoryName: group.category?.name ?? "",
  //   studentsCount: group.students?.length ?? 0,
  // }));
  // }, [groups]);

  const [globalFilter, setGlobalFilter] = React.useState("");

  const [data, setData] = React.useState(groups);
  const refreshData = () => setData(() => groups);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <Table className="w-full ">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-white">
            <TableHead className="!text-left font-mono">
              <div className="cursor-pointer select-none text-left">
                <p className="inline-flex relative uppercase font-mono">№</p>
              </div>
            </TableHead>

            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(header.column.getCanSort() ? "cursor-pointer select-none text-left" : "text-right")}
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
        {/* {groups.map((group, index) => { */}
        {table.getRowModel().rows.map((groupData, index) => {
          const group = groupData.original;
          console.log(groupData.getVisibleCells());
          return (
            <TableRow key={group.id} className="hover:bg-border/40">
              <TableCell className={cn("truncate max-w-[30px]", "text-left px-2 py-1")}>{index + 1}</TableCell>

              {groupData.getVisibleCells().map((cell, index) => {
                const textContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                const isStatusCol = index === groupData.getVisibleCells().length - 2;
                const isActionsCol = index === groupData.getVisibleCells().length - 1;
                let bageClassName = "text-success bg-success-background border-0";

                if (isStatusCol && textContent?.props.row.original.status === "Архів") {
                  bageClassName = "text-error bg-error-background border-0";
                }

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      index === 0 ? "truncate max-w-[200px]" : "",
                      isActionsCol ? "!text-right" : "",
                      "text-left px-2 py-1",
                    )}
                  >
                    {!isStatusCol && !isActionsCol && textContent}

                    {isActionsCol && (
                      <ActionsDropdown
                        itemId={1}
                        changeStatusFunction={() => {}}
                        onClickUpdateFunction={() => {}}
                        onClickDeleteFunction={() => {}}
                        changeCategoryFunction={() => {}}
                      />
                    )}

                    {isStatusCol && (
                      <Badge variant="outline" className={bageClassName}>
                        {textContent}
                      </Badge>
                    )}
                  </TableCell>
                );
              })}
              {/* <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "text-left px-2 py-1")}>
                {group.name}
              </TableCell>

              <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "text-left px-2 py-1")}>
                {group.category?.name}
              </TableCell>

              <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "text-left px-2 py-1")}>
                {group.courseNumber}
              </TableCell>

              <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "text-left px-2 py-1")}>
                {group.students?.length ?? 0}
              </TableCell>

              <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "text-left px-2 py-1")}>
                {group.formOfEducation}
              </TableCell>

              <TableCell className={cn("truncate max-w-[200px] text-left px-2 py-1")}>
                <Badge
                  variant="outline"
                  className={cn(
                    group.status === "Активний"
                      ? "text-success bg-success-background border-0"
                      : "text-error bg-error-background border-0",
                  )}
                >
                  {group.status}
                </Badge>
              </TableCell>

              <TableCell className={cn(true ? "truncate max-w-[200px]" : "", "!text-right px-2 py-1")}>
                <ActionsDropdown
                  itemId={1}
                  changeStatusFunction={() => {}}
                  onClickUpdateFunction={() => {}}
                  onClickDeleteFunction={() => {}}
                  changeCategoryFunction={() => {}}
                />
              </TableCell> */}
            </TableRow>
          );
        })}
        {/* {table.getRowModel().rows.map((row) => {
          return (
            <TableRow key={row.id} className="hover:bg-border/40">
              {row.getVisibleCells().map((cell, index) => {
                const textContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                const isStatusCol = index === row.getVisibleCells().length - 2;
                const isActionsCol = index === row.getVisibleCells().length - 1;
                let bageClassName = "text-success bg-success-background border-0";

                if (isStatusCol && textContent?.props.row.original.status === "Архів") {
                  bageClassName = "text-error bg-error-background border-0";
                }

                return (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      index === 0 ? "truncate max-w-[200px]" : "",
                      isActionsCol ? "!text-right" : "",
                      "text-left px-2 py-1",
                    )}
                  >
                    {!isStatusCol && !isActionsCol && textContent}

                    {isActionsCol && <TeacherActionsDropdown />}

                    {isStatusCol && (
                      <Badge variant="outline" className={bageClassName}>
                        {textContent}
                      </Badge>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })} */}
      </TableBody>
    </Table>
  );
};
