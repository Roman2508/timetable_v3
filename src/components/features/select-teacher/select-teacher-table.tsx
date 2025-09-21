import { useMemo, type Dispatch, type FC, type SetStateAction } from "react"
import { getTeacherFullname } from "@/helpers/get-teacher-fullname"

import { cn } from "@/lib/utils"
import type { AuditoriesTypes } from "@/store/auditories/auditories-types"
import type { TeachersType } from "@/store/teachers/teachers-types"

interface ISelectTeacherTableProps {
  teachers: TeachersType[]
  selectedTeacher: TeachersType | null
  setSelectedTeacher: Dispatch<SetStateAction<TeachersType | null>>
}

const SelectTeacherTable: FC<ISelectTeacherTableProps> = ({ teachers, selectedTeacher, setSelectedTeacher }) => {
  const columns = useMemo<{ label: string; key: string }[]>(
    () => [
      { label: "ПІБ", key: "name" },
      { label: "ЦК", key: "category" },
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
        {teachers.length ? (
          teachers.map((teacher) => (
            <div
              onClick={() => setSelectedTeacher(teacher)}
              className={cn(
                "flex px-4 py-2 border border-white border-t-border",
                "hover:border hover:border-primary cursor-pointer",
                selectedTeacher?.id === teacher.id ? "bg-primary-light border-primary text-primary" : "",
              )}
            >
              <div className="flex-1 truncate max-w-65 mr-1">{getTeacherFullname(teacher)}</div>
              <div className="flex-1 truncate max-w-65">{teacher.category.name}</div>
            </div>
          ))
        ) : (
          <div className="flex px-4 py-2 border border-white border-t-border">
            <div className="flex-1">-</div>
            <div className="flex-1">-</div>
          </div>
        )}
      </div>
    </div>
  )
}

export { SelectTeacherTable }
