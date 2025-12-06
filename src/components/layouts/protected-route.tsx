import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import { PATHS } from "@/constants/routes-config"
import ForbiddenPage from "@/pages/forbidden-page"
import { getAccessToken } from "@/helpers/session"
import { authSelector } from "@/store/auth/auth-slice"

const ProtectedRoute = () => {
  const { user, loadingStatus } = useSelector(authSelector)
  const location = useLocation()
  const token = getAccessToken()

  // Find the matching path config
  const currentPathKey = (Object.keys(PATHS) as Array<keyof typeof PATHS>).find((key) => {
    const config = PATHS[key]
    if (config.link === "/") return location.pathname === "/"
    return location.pathname.startsWith(config.link)
  })

  // If no config found, public access allowed (or handled elsewhere)
  if (!currentPathKey) {
    return <Outlet />
  }

  // Show loading spinner if:
  // 1. Redux is strictly loading
  // 2. OR we have a token but no user yet (pending restore/fetch in AuthLayout)
  const isRestoringSession = !user && !!token
  if (loadingStatus === "LOADING" || isRestoringSession) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const requiredRoles = PATHS[currentPathKey].roles

  // If user is not logged in AND not loading, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check role access
  const hasAccess = user.roles?.some((userRole) => {
    const roleKey = userRole.key?.toUpperCase()
    return requiredRoles.some((r) => r === (roleKey as any))
  })

  if (!hasAccess) {
    // Show 403 Forbidden page
    return <ForbiddenPage />
  }

  return <Outlet />
}

export default ProtectedRoute
