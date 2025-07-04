import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { customDayjs } from "~/lib/dayjs";
import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { generalSelector } from "~/store/general/general-slice";
import type { StreamsType } from "~/store/streams/streams-types";
import { settingsSelector } from "~/store/settings/settings-slice";
import { WideContainer } from "~/components/layouts/wide-container";
import type { TeachersType } from "~/store/teachers/teachers-types";
import type { GroupLoadStreamType } from "~/store/groups/groups-types";
import { LessonsTable } from "~/components/features/pages/timetable/lessons-table";
import TimetableHeader from "~/components/features/pages/timetable/timetable-header";
import { getGroupOverlay } from "~/store/schedule-lessons/schedule-lessons-async-actions";
import { clearGroupLoad, clearGroupOverlay } from "~/store/schedule-lessons/schedule-lessons-slice";
import TimetableCalendar from "~/components/features/pages/timetable/timetable-calendar";

export interface ISelectedLesson {
  id: number;
  name: string;
  students: number;
  totalHours: number;
  teacher: TeachersType;
  currentLessonHours: number;
  subgroupNumber: number | null;
  specialization: string | null;
  replacement: null | TeachersType;
  group: { id: number; name: string };
  stream: GroupLoadStreamType | StreamsType | null;
  typeRu: "ЛК" | "ПЗ" | "ЛАБ" | "СЕМ" | "ЕКЗ" | "КОНС" | "МЕТОД";
}

const TimetablePage = () => {
  const dispatch = useAppDispatch();

  const {
    timetable: { semester, item, type },
  } = useSelector(generalSelector);
  const { settings } = useSelector(settingsSelector);

  const [weeksCount, setWeeksCount] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [isPossibleToCreateLessons, setIsPossibleToCreateLessons] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<ISelectedLesson | null>(null);
  const [copyTheScheduleModalVisible, setCopyTheScheduleModalVisible] = useState(false);
  const [slectedGroupId, setSlectedGroupId] = useState<number | null>(type === "group" ? item : null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<null | number>(type === "teacher" ? item : null);
  const [selectedAuditoryId, setSelectedAuditoryId] = useState<number | null>(type === "auditory" ? item : null);

  // set weeks count in current semester
  useEffect(() => {
    if (!settings) return;

    if (!semester || semester === 1) {
      const endDate = customDayjs(settings.firstSemesterEnd);
      const weeksCount = endDate.diff(settings.firstSemesterStart, "week", true);
      const roundedUp = Math.ceil(weeksCount);
      setWeeksCount(roundedUp + 1);
      setSelectedSemester(1);
      return;
    }

    if (semester === 2) {
      const endDate = customDayjs(settings.secondSemesterEnd);
      const weeksCount = endDate.diff(settings.secondSemesterStart, "week", true);
      const roundedUp = Math.ceil(weeksCount);
      setWeeksCount(roundedUp + 1);
      setSelectedSemester(semester);
    }
  }, [settings, semester]);

  useEffect(() => {
    // Якщо дисципліна не об'єднана в потік
    if (!selectedLesson) return;

    // Якщо група не об'єднана в потік - очищаю накладки
    if (!selectedLesson.stream) {
      dispatch(clearGroupOverlay());
      return;
    }

    // Якщо дисципліна об'єднана в потік і кількість груп в потоці = або < 1
    if (selectedLesson.stream.groups.length <= 1) return;

    Promise.allSettled(
      selectedLesson.stream.groups.map(async (group) => {
        if (group.id === selectedLesson.group.id) return;
        await dispatch(getGroupOverlay({ semester: selectedSemester, groupId: group.id }));
      }),
    );
  }, [selectedLesson]);

  useEffect(() => {
    // очищаю group load для сторінки з розподілом навантаження
    return () => {
      dispatch(clearGroupLoad());
    };
  }, []);

  return (
    <WideContainer>
      <div className="w-full h-full">
        <TimetableHeader
          weeksCount={weeksCount}
          setSlectedGroupId={setSlectedGroupId}
          setSelectedLesson={setSelectedLesson}
        />

        <div className="flex gap-4">
          <div className="w-3/10 border">
            <LessonsTable
              selectedSemester={semester}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
              setSelectedTeacherId={setSelectedTeacherId}
              setIsPossibleToCreateLessons={setIsPossibleToCreateLessons}
            />
          </div>

          <TimetableCalendar
            weeksCount={weeksCount}
            slectedGroupId={slectedGroupId}
            selectedLesson={selectedLesson}
            selectedTeacherId={selectedTeacherId}
            setSelectedLesson={setSelectedLesson}
            selectedAuditoryId={selectedAuditoryId}
            setSelectedTeacherId={setSelectedTeacherId}
            setSelectedAuditoryId={setSelectedAuditoryId}
            isPossibleToCreateLessons={isPossibleToCreateLessons}
            setCopyTheScheduleModalVisible={setCopyTheScheduleModalVisible}
          />
        </div>
      </div>
    </WideContainer>
  );
};

export default TimetablePage;
