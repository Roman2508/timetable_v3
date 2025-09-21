import type { TeachersType } from "@/store/teachers/teachers-types"

export const getTeacherFullname = (teacher: TeachersType | null, variant: "short" | "full" = "full") => {
  if (!teacher) return ""

  if (variant === "full") {
    return `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`
  }
  if (variant === "short") {
    return `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName[0]}.`
  }
  return ""
}
