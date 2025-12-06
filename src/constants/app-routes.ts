export const APP_ROUTES = {
  DASHBOARD: "/",

  // Structure
  GROUPS: "/groups",
  STREAMS: "/streams",
  AUDITORIES: "/auditories",

  // Load
  PLANS: "/plans",
  DISTRIBUTION: "/distribution",
  VIEW_DISTRIBUTION_LOAD: "/view-distribution-load",

  // Accounts
  TEACHERS: "/teachers",
  STUDENTS: "/students",
  STUDENTS_DIVIDE: "/students-divide",

  // Timetable
  TIMETABLE: "/timetable",
  TIMETABLE_CONTROL: "/timetable-control",
  MY_TIMETABLE: "/my-timetable",
  FIND_FREE_AUDITORY: "/find-free-auditory",

  // General
  PROFILE: "/profile",
  GRADE_BOOK: "/grade-book",
  INSTRUCTIONAL_MATERIALS: "/instructional-materials",
  INDIVIDUAL_TEACHER_WORK: "/individual-teacher-work",
  TEACHER_ACTIVITIES_TYPES: "/teacher-activities-types",
  TEACHERS_REPORT: "/teachers-report",
  MY_TEACHING_LOAD: "/my-teaching-load",

  // Settings
  SETTINGS: "/settings",
} as const

export type AppRouteType = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
