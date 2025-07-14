import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import {
  getInstructionalMaterials,
  findAllTeacherLessonsByIdAndYear,
} from "~/store/teacher-profile/teacher-profile-async-actions";
import { customDayjs } from "~/lib/dayjs";
import { useAppDispatch } from "~/store/store";
import { authSelector } from "~/store/auth/auth-slice";
import { LoadingStatusTypes } from "~/store/app-types";
import { Input } from "~/components/ui/common/input";
import { Separator } from "~/components/ui/common/separator";
import type { GroupLoadType } from "~/store/groups/groups-types";
import LoadingSpinner from "~/components/ui/icons/loading-spinner";
import { RootContainer } from "~/components/layouts/root-container";
import DropdownSelect from "~/components/ui/custom/dropdown-select";
import { teacherProfileSelector } from "~/store/teacher-profile/teacher-profile-slice";
import ExportLessonThemes from "~/components/features/pages/instructional-materials/export-lesson-themes";
import ImportLessonThemes from "~/components/features/pages/instructional-materials/import-lesson-themes";
import { InstructionalMaterialsTable } from "~/components/features/pages/instructional-materials/instructional-materials-table";
import { TEMPORARY_TEACHER_ID } from "~/constants";

interface IFilter {
  ["1"]: GroupLoadType[];
  ["2"]: GroupLoadType[];
}

export default function InstructionalMaterialsPage() {
  const dispatch = useAppDispatch();

  const { user } = useSelector(authSelector);
  const { filterLesson, loadingStatus } = useSelector(teacherProfileSelector);

  const [semester, setSemester] = useState<1 | 2>(1);
  const [showedYear, setShowedYear] = useState(customDayjs().year());
  const [filter, setFilter] = useState<IFilter>({ ["1"]: [], ["2"]: [] });
  const [selectedLesson, setSelectedLesson] = useState<GroupLoadType | null>(null);

  const lessons = useMemo(
    () =>
      filterLesson
        ? filter[semester].map((el) => ({ id: el.id, name: `${el.group.name} / ${el.typeRu} / ${el.name}` }))
        : [],
    [filterLesson, semester, filter],
  );

  const handleChangeSelectedLesson = (id: number) => {
    if (!filterLesson) return;
    const lesson = filterLesson.find((el) => el.id === id);
    if (lesson) setSelectedLesson(lesson);
  };

  useEffect(() => {
    setSelectedLesson(null);
    dispatch(findAllTeacherLessonsByIdAndYear({ teacherId: TEMPORARY_TEACHER_ID, year: showedYear }));
    // if (!user) return;
    // dispatch(findAllTeacherLessonsByIdAndYear({ teacherId: user.id, year: showedYear }));
  }, [user, showedYear]);

  useEffect(() => {
    if (!selectedLesson) return;
    const payload = { id: selectedLesson.id, year: showedYear };
    dispatch(getInstructionalMaterials(payload));
  }, [selectedLesson, showedYear]);

  useEffect(() => {
    if (!filterLesson) return;

    const firstSemesterLessons = filterLesson.filter(
      (el) => el.semester === 1 || el.semester === 3 || el.semester === 5,
    );
    const secondSemesterLessons = filterLesson.filter(
      (el) => el.semester === 2 || el.semester === 4 || el.semester === 6,
    );

    setFilter({ ["1"]: firstSemesterLessons, ["2"]: secondSemesterLessons });
  }, [filterLesson]);

  return (
    <RootContainer>
      <h1 className="text-center font-semibold text-lg mb-4">Навчально-методичні комплекси</h1>

      <div className="flex justify-center items-center gap-2 mb-4">
        <p>НМК за</p>
        <Input
          className="w-18 px-2 bg-white"
          type="number"
          value={showedYear}
          onChange={(e) => {
            setFilter({ ["1"]: [], ["2"]: [] });
            setShowedYear(Number(e.target.value));
          }}
        />
        <p>- {showedYear + 1} н.р.</p>
      </div>

      <DropdownSelect
        label="Півріччя"
        selectedItem={semester}
        classNames="w-full mb-6"
        items={[
          { id: 1, name: "1" },
          { id: 2, name: "2" },
        ]}
        onChange={(semester) => setSemester(semester as 1 | 2)}
      />

      <DropdownSelect
        label="Дисципліна"
        classNames="w-full mb-6"
        items={lessons || []}
        selectedItem={selectedLesson ? selectedLesson.id : ""}
        onChange={(selected) => handleChangeSelectedLesson(selected)}
      />

      <div className="flex justify-center gap-4 mb-4">
        <ExportLessonThemes />
        <ImportLessonThemes selectedLesson={selectedLesson} showedYear={showedYear} />
      </div>

      <Separator className="mb-4" />

      {!selectedLesson ? (
        <p className="font-mono my-10 text-center">Виберіть дисципліну</p>
      ) : loadingStatus === LoadingStatusTypes.LOADING ? (
        <LoadingSpinner />
      ) : (
        <InstructionalMaterialsTable selectedLesson={selectedLesson} showedYear={showedYear} />
      )}
    </RootContainer>
  );
}
