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
    timetable: { semester, week, item, category, type },
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
    const { firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd } = settings;

    if (!semester || semester === 1) {
      const endDate = customDayjs(firstSemesterEnd);
      const weeksCount = endDate.diff(firstSemesterStart, "week", true);
      const roundedUp = Math.ceil(weeksCount);
      setWeeksCount(roundedUp + 1);
      setSelectedSemester(1);
      return;
    }

    if (semester === 2) {
      const endDate = customDayjs(secondSemesterEnd);
      const weeksCount = endDate.diff(secondSemesterStart, "week", true);
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

          <div className="w-7/10 border-t">
            <div className="flex border-x">
              <div className="flex justify-between w-full">
                <div className="flex gap-2 p-2">
                  <Button variant="outline" size="sm">
                    Наступний тиждень
                  </Button>
                  <Button variant="outline" size="sm">
                    Попередній тиждень
                  </Button>
                </div>

                <div className="p-2">
                  <Button variant="outline" size="sm">
                    Копіювати розклад
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-6 border-l">
                <div className="h-8 border-t h-[33px]"></div>
                {[...Array(7)].map((_, i) => (
                  <div
                    className={i === 6 ? "text-xs font-bold h-25 p-2 border-y" : "text-xs font-bold h-25 p-2 border-t"}
                    key={i}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="w-full border-l grid grid-cols-6">
                {[...Array(6)].map((_, i) => (
                  <div className="border-t" key={i}>
                    <div className="border-b p-2 border-r text-xs font-bold h-[33px]">Пн 02.09</div>

                    {[...Array(7)].map((_, j) => (
                      <div className="h-25 border-b p-2 text-xs border-r overflow-hidden" key={j}>
                        <p>Lorem ipsum dolor sit amet consectetur</p>
                        <p>Ab modi veritatis</p>
                        <p>consectetur adipisicing</p>
                        <p>sit amet</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WideContainer>
  );
};

export default TimetablePage;
