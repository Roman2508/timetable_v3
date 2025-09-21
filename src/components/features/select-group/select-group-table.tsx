import { useMemo, type Dispatch, type FC, type SetStateAction } from "react"

import { cn } from "@/lib/utils"
import type { GroupsShortType } from "@/store/groups/groups-types"

interface ISelectGroupTableProps {
  groups: GroupsShortType[]
  selectedGroup: GroupsShortType | null
  setSelectedGroup: Dispatch<SetStateAction<GroupsShortType | null>>
}

export const SelectGroupTable: FC<ISelectGroupTableProps> = ({ groups, selectedGroup, setSelectedGroup }) => {
  const columns = useMemo<{ label: string; key: string }[]>(
    () => [
      { label: "Назва", key: "name" },
      { label: "Курс", key: "course" },
      { label: "Студентів", key: "students" },
    ],
    [],
  )

  return (
    <div className="">
      <div className="flex px-4 py-2 border-b">
        {columns.map((el) => (
          <div key={el.key} className="flex-1 uppercase opacity-[0.9] font-mono cursor-default">
            {el.label}
          </div>
        ))}
      </div>

      <div className="">
        {groups.map((group) => (
          <div
            onClick={() => setSelectedGroup(group)}
            className={cn(
              "flex px-4 py-2 border border-white border-t-border",
              "hover:border hover:border-primary cursor-pointer",
              selectedGroup?.id === group.id ? "bg-primary-light border-primary text-primary" : "",
            )}
          >
            <div className="flex-1">{group.name}</div>
            <div className="flex-1">{group.courseNumber}</div>
            <div className="flex-1">{group.students.length}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
