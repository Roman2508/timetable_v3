import type { Dayjs } from "dayjs"
import { customDayjs } from "~/lib/dayjs"

const testStart = "2024-01-01"
const testEnd = "2024-03-03"

export type WeekType = {
  data: Dayjs
  start: string
  end: string
  number: number
}

const getCalendarWeek = (
  currentWeekNumber: number = 1,
  start: string = testStart,
  end: string = testEnd,
): WeekType[] => {
  const weeks = []

  if (!customDayjs(start).isValid()) return []

  let week = customDayjs(start)

  while (!week.isAfter(customDayjs(end).add(1, "week"))) {
    if (weeks.length > 30) break

    const days = []

    let day = customDayjs(week).startOf("week")

    while (!day.isAfter(customDayjs(week).endOf("week"))) {
      days.push(day)
      day = day.add(1, "day")
    }

    const dayItem = days.map((el, index) => {
      const data = el
      const start = data.clone().format("DD.MM.YY")
      const end = data.clone().endOf("day").format("DD.MM.YY")
      return { data, start, end, number: index + 1 }
    })

    weeks.push(dayItem)
    week = week.add(1, "week")
  }

  return weeks[currentWeekNumber - 1]
}

export default getCalendarWeek
