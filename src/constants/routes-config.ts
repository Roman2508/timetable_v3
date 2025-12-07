import { APP_ROUTES, type AppRouteType } from "@/constants/app-routes"
import { UserRoles, type UserRolesKeysType } from "@/store/auth/auth-types"

interface PathConfig {
  link: AppRouteType
  roles: UserRolesKeysType[]
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
      UserRoles.ROOT_ADMIN,
      UserRoles.TEACHER,
      UserRoles.STUDENT,
      UserRoles.METHODIST,
      UserRoles.GUEST,
    ],
  },

  // Structure
  GROUPS: {
    link: APP_ROUTES.GROUPS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  STREAMS: {
    link: APP_ROUTES.STREAMS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  AUDITORIES: {
    link: APP_ROUTES.AUDITORIES,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },

  // Load
  PLANS: {
    link: APP_ROUTES.PLANS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  DISTRIBUTION: {
    link: APP_ROUTES.DISTRIBUTION,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  VIEW_DISTRIBUTION_LOAD: {
    link: APP_ROUTES.VIEW_DISTRIBUTION_LOAD,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },

  // Accounts
  TEACHERS: {
    link: APP_ROUTES.TEACHERS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  STUDENTS: {
    link: APP_ROUTES.STUDENTS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  STUDENTS_DIVIDE: {
    link: APP_ROUTES.STUDENTS_DIVIDE,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },

  // Timetable
  TIMETABLE: {
    link: APP_ROUTES.TIMETABLE,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  TIMETABLE_CONTROL: {
    link: APP_ROUTES.TIMETABLE_CONTROL,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },
  MY_TIMETABLE: {
    link: APP_ROUTES.MY_TIMETABLE,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  },
  FIND_FREE_AUDITORY: {
    link: APP_ROUTES.FIND_FREE_AUDITORY,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN],
  },

  // General
  PROFILE: {
    link: APP_ROUTES.PROFILE,
    roles: [
      UserRoles.ADMIN,
      UserRoles.ROOT_ADMIN,
      UserRoles.TEACHER,
      UserRoles.STUDENT,
      UserRoles.METHODIST,
      UserRoles.GUEST,
    ],
  },
  GRADE_BOOK: {
    link: APP_ROUTES.GRADE_BOOK,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  },
  INSTRUCTIONAL_MATERIALS: {
    link: APP_ROUTES.INSTRUCTIONAL_MATERIALS,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER],
  },
  INDIVIDUAL_TEACHER_WORK: {
    link: APP_ROUTES.INDIVIDUAL_TEACHER_WORK,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER],
  },
  TEACHER_ACTIVITIES_TYPES: {
    link: APP_ROUTES.TEACHER_ACTIVITIES_TYPES,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.METHODIST],
  },
  TEACHERS_REPORT: {
    link: APP_ROUTES.TEACHERS_REPORT,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER],
  },
  MY_TEACHING_LOAD: {
    link: APP_ROUTES.MY_TEACHING_LOAD,
    roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN, UserRoles.TEACHER],
  },

  // Generic fallback for any other admin pages
  SETTINGS: { link: APP_ROUTES.SETTINGS, roles: [UserRoles.ADMIN, UserRoles.ROOT_ADMIN] },
}
