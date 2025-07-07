import { useMemo, type Dispatch, type FC, type SetStateAction } from "react";

import { cn } from "~/lib/utils";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";

interface ISelectAuditoryTableProps {
  auditories: AuditoriesTypes[];
  selectedAuditory: AuditoriesTypes | null;
  setSelectedAuditory: Dispatch<SetStateAction<AuditoriesTypes | null>>;
}

export const SelectAuditoryTable: FC<ISelectAuditoryTableProps> = ({
  auditories,
  selectedAuditory,
  setSelectedAuditory,
}) => {
  const columns = useMemo<{ label: string; key: string }[]>(
    () => [
      { label: "Назва", key: "name" },
      { label: "Кількість місць", key: "seatsNumber" },
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
        {auditories.map((auditory) => (
          <div
            onClick={() => setSelectedAuditory(auditory)}
            className={cn(
              "flex px-4 py-2 border border-white border-t-border",
              "hover:border hover:border-primary cursor-pointer",
              selectedAuditory?.id === auditory.id ? "bg-primary-light border-primary text-primary" : "",
            )}
          >
            <div className="flex-1">{auditory.name}</div>
            <div className="flex-1">{auditory.seatsNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
