import { customDayjs } from "~/lib/dayjs"

export const getDate = (date: string | Date, format: string = "DD.MM.YYYY") => {
  return customDayjs(date, format)
}
