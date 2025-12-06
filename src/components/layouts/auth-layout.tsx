import jwtDecode from "jwt-decode"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

import { useAppDispatch } from "@/store/store"
import type { SessionType } from "@/api/api-types"
import { getAccessToken } from "@/helpers/session"
import { authSelector } from "@/store/auth/auth-slice"

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { user } = useSelector(authSelector)

  useEffect(() => {
    if (user) return
    const token = getAccessToken()

    // Check validity locally first
    const session = token ? jwtDecode<SessionType>(token) : null

    if (session && session.user) {
      // Instead of just setting user from token (which might have stale/partial role data),
      // we prefer to fetch the fresh profile.
      // However, to avoid waiting, we can set the user from token temporarily
      // OR just trigger the fetch.
      // The user requested a loading spinner, so we will trigger fetch.
      // We don't set user here to force the loading state in ProtectedRoute.
      // But we must dispatch getProfile.

      // Import missing getProfile action
      import("@/store/auth/auth-async-actions").then(({ getProfile }) => {
        dispatch(getProfile())
      })
    } else {
      navigate("/auth")
    }
  }, [dispatch, navigate, user])

  return <>{children}</>
}

export default AuthLayout
