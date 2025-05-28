import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uk";

dayjs.extend(relativeTime);
dayjs.locale("uk");

export { dayjs };
