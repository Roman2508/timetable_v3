import { useMemo } from "react"

export type ItemType = {
  status: "Активний" | "Архів"
  [key: string]: any
}

// type ReturnType = {
//   filteredItems: ItemType[]
//   counts: { all: number; active: number; archive: number }
// }

// export function useItemsByStatus<T extends Record<string, any>>(
//   items: T[] | null,
//   targetKey: keyof T,
//   status: string,
// ): ReturnType {
//   const { filteredItems, counts } = useMemo(() => {
//     if (!items) {
//       return {
//         filteredItems: [],
//         counts: { all: 0, active: 0, archive: 0 },
//       }
//     }

//     const allItems: ItemType[] = items.flatMap((item) => {
//       const nested = item[targetKey]
//       return Array.isArray(nested) ? nested : []
//     })

//     const filteredItems = status === "Всі" ? allItems : allItems.filter((el) => el.status === status)

//     const counts = {
//       all: allItems.length,
//       active: allItems.filter((el) => el.status === "Активний").length,
//       archive: allItems.filter((el) => el.status === "Архів").length,
//     }

//     return { filteredItems, counts }
//   }, [items, targetKey, status])

//   return { filteredItems, counts }
// }

type StatusCountsDefault = {
  all: number
  active: number
  archive: number
}

type StatusCountsStudents = {
  all: number
  studying: number
  expelled: number
  academicLeave: number
}

export function useItemsByStatus<
  T extends Record<string, any>,
  K extends keyof T,
  U extends { status: string } = any,
  Mode extends "default" | "students" = "default",
>(items: T[] | null, targetKey: K, status: string, variant: "default" | "students" = "default") {
  type NestedItem = T[K] extends U[] ? U : never
  type Counts = Mode extends "students" ? StatusCountsStudents : StatusCountsDefault

  const { filteredItems, counts } = useMemo(() => {
    if (!items) {
      return {
        filteredItems: [] as NestedItem[],
        counts:
          variant === "default"
            ? { all: 0, active: 0, archive: 0 }
            : { all: 0, studying: 0, expelled: 0, academicLeave: 0 },
      }
    }

    const allItems: NestedItem[] = items.flatMap((item) => {
      const nested = item[targetKey]
      return Array.isArray(nested) ? nested : []
    })

    const filteredItems = status === "Всі" ? allItems : allItems.filter((el) => el.status === status)

    const counts: any =
      variant === "students"
        ? {
            all: allItems.length,
            studying: allItems.filter((el) => el.status === "Навчається").length,
            expelled: allItems.filter((el) => el.status === "Відраховано").length,
            academicLeave: allItems.filter((el) => el.status === "Академічна відпустка").length,
          }
        : {
            all: allItems.length,
            active: allItems.filter((el) => el.status === "Активний").length,
            archive: allItems.filter((el) => el.status === "Архів").length,
          }

    return { filteredItems, counts }
  }, [items, targetKey, status])

  return { filteredItems, counts } as {
    filteredItems: NestedItem[]
    counts: Counts
  }
}
