import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import {
  clearTeacherReports,
  teacherProfileSelector,
  clearIndividualTeacherWork,
} from "~/store/teacher-profile/teacher-profile-slice";
import { customDayjs } from "~/lib/dayjs";
import { useAppDispatch } from "~/store/store";
import { TEMPORARY_TEACHER_ID } from "~/constants";
import { Input } from "~/components/ui/common/input";
import { sortItemsByKey } from "~/helpers/sort-items-by-key";
import { Accordion } from "~/components/ui/common/accordion";
import { RootContainer } from "~/components/layouts/root-container";
import type { IndividualWorkPlanType } from "~/store/teacher-profile/teacher-profile-types";
import { getIndividualTeacherWork, getTeacherReport } from "~/store/teacher-profile/teacher-profile-async-actions";
import IndividualTeacherWorkItem from "~/components/features/pages/individual-teacher-work/individual-teacher-work-item";

export const categoriesTypes = ["Методична робота", "Наукова робота", "Організаційна робота"] as const;

export default function IndividualTeacherWork() {
  const { individualWorkPlan, report } = useSelector(teacherProfileSelector);

  const dispatch = useAppDispatch();

  const [plannedHours, setPlannedHours] = useState(0);
  const [showedYear, setShowedYear] = useState(customDayjs().year());

  const selectedWorkTypes = useMemo(
    () =>
      (individualWorkPlan || [])
        .filter((work) => (report || []).some((rep) => rep.individualWork.id === work.id))
        .map((el) => el.id),
    [individualWorkPlan, report],
  );

  useEffect(() => {
    dispatch(clearTeacherReports());
    dispatch(getIndividualTeacherWork());
    dispatch(clearIndividualTeacherWork());
    dispatch(getTeacherReport({ year: showedYear, id: TEMPORARY_TEACHER_ID }));
  }, [showedYear]);

  useEffect(() => {
    if (!report) return;
    const plannedHours = report.reduce((acc, cur) => Number(cur.hours) + acc, 0);
    // const plannedActivities = report.filter((el) => el.status);
    // const plannedHours = plannedActivities.reduce((acc, cur) => Number(cur.hours) + acc, 0);
    setPlannedHours(plannedHours);
  }, [report]);

  return (
    <RootContainer classNames="relative">
      <h1 className="text-center font-semibold text-lg mb-4">Індивідуальний план роботи викладача</h1>

      <div className="flex justify-center items-center gap-2 mb-4">
        <p>НМК за</p>
        <Input
          className="w-18 px-2 bg-white"
          type="number"
          value={showedYear}
          onChange={(e) => {
            setShowedYear(Number(e.target.value));
          }}
        />
        <p>- {showedYear + 1} н.р.</p>
      </div>

      <p className="text-center mb-8">Заплановано на навчальний рік {plannedHours} годин.</p>

      {categoriesTypes.map((type) => {
        if (!individualWorkPlan) return;
        const individualWork = individualWorkPlan.filter((w) => w.type === type);

        return (
          <div className="mb-10" key={type}>
            <div className="flex items-center mb-4">
              <div className="h-[1px] flex-1 bg-border"></div>
              <div className="bg-sidebar py-1 px-4 border text-sm">{type}</div>
              <div className="h-[1px] flex-1 bg-border"></div>
            </div>

            <Accordion type="multiple">
              {sortItemsByKey(individualWork, "name").map((workItem: IndividualWorkPlanType) => {
                const addedReport = report?.find((r) => r.individualWork.id === workItem.id);
                return (
                  <IndividualTeacherWorkItem
                    key={workItem.id}
                    workItem={workItem}
                    showedYear={showedYear}
                    addedReport={addedReport}
                    selectedWorkTypes={selectedWorkTypes}
                  />
                );
              })}
            </Accordion>
          </div>
        );
      })}
    </RootContainer>
  );
}
