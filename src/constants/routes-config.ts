import { APP_ROUTES, type AppRouteType } from "@/constants/app-routes"
import { UserRoles } from "@/store/auth/auth-types"

type Role = (typeof UserRoles)[keyof typeof UserRoles]

interface PathConfig {
  link: AppRouteType
  roles: Role[]
}

/**
 * PATHS configuration to define access control for specific routes.
 * Keys match the keys in APP_ROUTES to ensure synchronization.
 */
export const PATHS: Record<keyof typeof APP_ROUTES, PathConfig> = {
  DASHBOARD: {
    link: APP_ROUTES.DASHBOARD,
    roles: [
      UserRoles.ADMIN,
      UserRoles.TEACHER,
      UserRoles.STUDENT,
      UserRoles.GUEST,
      UserRoles.METHODIST,
      UserRoles.HEAD_OF_DEPARTMENT,
    ],
  },

  // Structure
  GROUPS: {
    link: APP_ROUTES.GROUPS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.GUEST],
  },
  STREAMS: {
    link: APP_ROUTES.STREAMS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  AUDITORIES: {
    link: APP_ROUTES.AUDITORIES,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },

  // Load
  PLANS: {
    link: APP_ROUTES.PLANS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  DISTRIBUTION: {
    link: APP_ROUTES.DISTRIBUTION,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  VIEW_DISTRIBUTION_LOAD: {
    link: APP_ROUTES.VIEW_DISTRIBUTION_LOAD,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.HEAD_OF_DEPARTMENT],
  },

  // Accounts
  TEACHERS: {
    link: APP_ROUTES.TEACHERS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  STUDENTS: {
    link: APP_ROUTES.STUDENTS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  STUDENTS_DIVIDE: {
    link: APP_ROUTES.STUDENTS_DIVIDE,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },

  // Timetable
  TIMETABLE: {
    link: APP_ROUTES.TIMETABLE,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  TIMETABLE_CONTROL: {
    link: APP_ROUTES.TIMETABLE_CONTROL,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  MY_TIMETABLE: {
    link: APP_ROUTES.MY_TIMETABLE,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  },
  FIND_FREE_AUDITORY: {
    link: APP_ROUTES.FIND_FREE_AUDITORY,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  },

  // General
  PROFILE: {
    link: APP_ROUTES.PROFILE,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  },
  GRADE_BOOK: {
    link: APP_ROUTES.GRADE_BOOK,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  INSTRUCTIONAL_MATERIALS: {
    link: APP_ROUTES.INSTRUCTIONAL_MATERIALS,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  INDIVIDUAL_TEACHER_WORK: {
    link: APP_ROUTES.INDIVIDUAL_TEACHER_WORK,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  TEACHER_ACTIVITIES_TYPES: {
    link: APP_ROUTES.TEACHER_ACTIVITIES_TYPES,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  TEACHERS_REPORT: {
    link: APP_ROUTES.TEACHERS_REPORT,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },
  MY_TEACHING_LOAD: {
    link: APP_ROUTES.MY_TEACHING_LOAD,
    roles: [UserRoles.ADMIN, UserRoles.TEACHER],
  },

  // Generic fallback for any other admin pages
  SETTINGS: { link: APP_ROUTES.SETTINGS, roles: [UserRoles.ADMIN] },
}
