import type { Dayjs } from "dayjs"
import { customDayjs } from "@/lib/dayjs"

const currentYear = new Date().getFullYear()
const testStart = `01.09.${currentYear}`
const testEnd = `20.12.${currentYear}`

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

  const fixedStart = `${start.slice(3, 5)}.${start.slice(0, 2)}.${start.slice(6, 10)}`

  if (!customDayjs(fixedStart).isValid()) return []

  let week = customDayjs(fixedStart)

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
