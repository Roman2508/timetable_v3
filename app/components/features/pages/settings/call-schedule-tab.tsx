import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ClipboardMinusIcon } from "lucide-react";

import { useAppDispatch } from "~/store/store";
import { Button } from "~/components/ui/common/button";
import { InputTime } from "~/components/ui/custom/input-time";
import { settingsSelector } from "~/store/settings/settings-slice";
import { updateCallSchedule } from "~/store/settings/settings-async-actions";

const lessons = ["1", "2", "3", "4", "5", "6", "7"] as const;

const callScheduleInitialState = {
  ["1"]: { start: "08:30", end: "09:50" },
  ["2"]: { start: "10:00", end: "11:20" },
  ["3"]: { start: "12:00", end: "13:20" },
  ["4"]: { start: "13:30", end: "14:50" },
  ["5"]: { start: "15:00", end: "16:20" },
  ["6"]: { start: "16:30", end: "17:50" },
  ["7"]: { start: "18:00", end: "19:20" },
};

const CallScheduleTab = () => {
  const dispatch = useAppDispatch();

  const { settings } = useSelector(settingsSelector);

  const [isFetching, setIsFetching] = useState(false);
  const [callSchedule, setCallSchedule] = useState(callScheduleInitialState);

  const handleChangeCallSchedule = (key: (typeof lessons)[number], value: "start" | "end", newTime: string) => {
    setCallSchedule((prev) => ({ ...prev, [key]: { ...prev[key], [value]: newTime } }));
  };

  const fetchCallSchedule = async () => {
    try {
      setIsFetching(true);
      await dispatch(updateCallSchedule(callSchedule));
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!settings) return;
    setCallSchedule((prev) => ({ ...prev, ...settings.callSchedule }));
  }, [settings]);

  return (
    <>
      <>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
          <ClipboardMinusIcon className="w-5" /> Розклад дзвінків
        </h2>

        <div className="mb-10">
          <p className="text-muted-foreground mb-6">
            Тут ви можете оновити дати початку й завершення навчання — це впливає на доступність дат у редакторі
            розкладу та календарі.
          </p>

          {lessons.map((lessonNumber) => (
            <div className="flex gap-2 mb-4" key={lessonNumber}>
              <p className="text-lg font-bold mt-7.5 mr-2">{lessonNumber}.</p>

              <div className="flex-1">
                <p className="text-sm mb-1">Початок</p>
                <InputTime
                  value={callSchedule[lessonNumber].start}
                  onValueChange={(newTime) => handleChangeCallSchedule(lessonNumber, "start", newTime)}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm mb-1">Кінець</p>
                <InputTime
                  value={callSchedule[lessonNumber].end}
                  onValueChange={(newTime) => handleChangeCallSchedule(lessonNumber, "end", newTime)}
                />
              </div>
            </div>
          ))}

          <Button className="mt-4" onClick={fetchCallSchedule} disabled={isFetching}>
            {isFetching ? "Завантаження..." : "Зберегти зміни"}
          </Button>
        </div>
      </>
    </>
  );
};

export { CallScheduleTab };
