import type { Dispatch, SetStateAction } from "react";

import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/common/input";
import AbsentIcon from "~/components/ui/icons/absent-icon";
import { Checkbox } from "~/components/ui/common/checkbox";
import type { GradeBookSummaryTypes, GradeType } from "~/store/gradeBook/grade-book-types";

interface IGradeBookTableCellProps {
  gradeId: number;
  colIndex: number;
  rowIndex: number;
  grades: GradeType[];
  updageGrade: () => void;
  isDefaultCell?: boolean;
  showAbsenceCheckbox?: boolean;
  cellData: GradeType & { student: number };
  summaryType?: null | GradeBookSummaryTypes;
  backupGrade: (GradeType & { student: number }) | null;
  setCellData: Dispatch<SetStateAction<GradeType & { student: number }>>;
  setBackupGrade: Dispatch<SetStateAction<(GradeType & { student: number }) | null>>;
  hoveredCell: { col: number; row: number; summaryType: null | GradeBookSummaryTypes };
  setHoveredSell: Dispatch<SetStateAction<{ col: number; row: number; summaryType: null | GradeBookSummaryTypes }>>;
}

const GradeBookTableCell: React.FC<IGradeBookTableCellProps> = ({
  grades,
  gradeId,
  colIndex,
  rowIndex,
  cellData,
  setCellData,
  hoveredCell,
  updageGrade,
  backupGrade,
  setHoveredSell,
  setBackupGrade,
  summaryType = null,
  isDefaultCell = false,
  showAbsenceCheckbox = true,
}) => {
  const currentCellData = grades.find((el) => {
    if (summaryType) {
      return el.lessonNumber === colIndex && el.summaryType === summaryType;
    }
    return el.lessonNumber === colIndex + 1 && el.summaryType === summaryType;
  });

  const onHoverCell = () => {
    setHoveredSell({ col: colIndex, row: rowIndex, summaryType });
    // is grade exist
    if (currentCellData) {
      const data = {
        summaryType,
        student: gradeId,
        rating: currentCellData.rating,
        isAbsence: currentCellData.isAbsence,
        lessonNumber: currentCellData.lessonNumber,
      };
      setCellData(data);
      setBackupGrade(data);
    } else {
      const data = {
        rating: 0,
        summaryType,
        student: gradeId,
        isAbsence: false,
        lessonNumber: summaryType ? colIndex : colIndex + 1,
      };
      setCellData(data);
      setBackupGrade(data);
    }
  };

  return (
    <td
      className={cn(
        isDefaultCell ? "bg-white" : "bg-sidebar",
        "min-w-[80px] text-center py-1 border-x border-t overflow-hidden",
      )}
    >
      <div
        onMouseEnter={onHoverCell}
        onMouseLeave={updageGrade}
        onKeyDown={(e) => {
          if (e.key === "Enter") updageGrade();
          if (e.key === "Escape") backupGrade && setCellData(backupGrade);
        }}
        className={cn(showAbsenceCheckbox ? "flex justify-center items-center font-normal gap-2" : "")}
      >
        {hoveredCell.col === colIndex && hoveredCell.row === rowIndex && hoveredCell.summaryType === summaryType ? (
          <>
            {showAbsenceCheckbox && (
              <AbsentIcon
                classNames={cn("cursor-pointer fill-primary", cellData.isAbsence ? "" : "opacity-[0.1]")}
                onClick={() => setCellData((prev) => ({ ...prev, isAbsence: !prev.isAbsence }))}
              />
            )}

            <Input
              type="number"
              className="p-0 bg-white border-0 h-5 w-[50%] text-sm"
              value={cellData.rating !== 0 ? cellData.rating : ""}
              onChange={(e) => setCellData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
            />
          </>
        ) : (
          <>
            {showAbsenceCheckbox && (
              <AbsentIcon classNames={cn(currentCellData?.isAbsence ? "opacity-[1]" : "opacity-[0.1]")} />
            )}

            <p
              className="w-[50%] text-left text-sm"
              // style={
              //   showAbsenceCheckbox
              //     ? { fontWeight: "400" }
              //     : { fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center" }
              // }
            >
              {currentCellData?.rating ? currentCellData.rating : ""}
            </p>
          </>
        )}
      </div>
    </td>
  );
};

export default GradeBookTableCell;
