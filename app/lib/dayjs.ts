import dayjs from "dayjs";
import uk from "dayjs/locale/uk";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import dayOfYear from "dayjs/plugin/dayOfYear";
dayjs.extend(dayOfYear);

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.locale(uk);

dayjs.updateLocale("uk", {
  weekdaysShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  months: [
    "Січня",
    "Лютого",
    "Березня",
    "Квітня",
    "Травня",
    "Червня",
    "Липня",
    "Серпня",
    "Вересня",
    "Жовтня",
    "Листопада",
    "Грудня",
  ],
});

export const customDayjs = dayjs;

// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import "dayjs/locale/uk";

// dayjs.extend(relativeTime);
// dayjs.locale("uk");

// export { dayjs };
