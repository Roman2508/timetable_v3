import React from "react";
import { cn } from "~/lib/utils";

const groupsList = [
  { name: "PH9-25- 27", course: 25, students: 54 },
  { name: "PH9-25- 87", course: 51, students: 16 },
  { name: "PH9-25- 12", course: 2, students: 74 },
  { name: "PH9-25- 33", course: 3, students: 27 },
  { name: "PH9-25- 45", course: 38, students: 80 },
  { name: "PH9-25- 01", course: 83, students: 67 },
  { name: "PH9-25- 41", course: 96, students: 34 },
  { name: "PH9-25- 53", course: 38, students: 85 },
  { name: "PH9-25-11", course: 65, students: 3 },
];

export const SelectGroupTable = () => {
  const columns = React.useMemo<{ label: string; key: string }[]>(
    () => [
      { label: "Назва", key: "name" },
      { label: "Курс", key: "course" },
      { label: "Студентів", key: "students" },
    ],
    [],
  );

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
        {groupsList.map((group) => (
          <div
            className={cn(
              "flex px-4 py-2 border border-white border-t-border",
              "hover:border hover:border-primary cursor-pointer",
            )}
          >
            <div className="flex-1">{group.name}</div>
            <div className="flex-1">{group.course}</div>
            <div className="flex-1">{group.students}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
