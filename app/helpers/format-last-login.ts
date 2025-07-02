import { customDayjs } from "../lib/dayjs";

export const formatLastLogin = (date: string) => {
  if (!date) return "Ніколи";
  const cleanedDate = date.split(".")[0] + "Z";
  const formatted = customDayjs(cleanedDate).fromNow();
  return formatted;
};
