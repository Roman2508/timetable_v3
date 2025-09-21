import jwtDecode from "jwt-decode"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

import { useAppDispatch } from "@/store/store"
import type { SessionType } from "@/api/api-types"
import { getAccessToken } from "@/helpers/session"
import { authSelector, setUser } from "@/store/auth/auth-slice"

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { user } = useSelector(authSelector)

  useEffect(() => {
    if (user) return
    const token = getAccessToken()
    const session = token ? jwtDecode<SessionType>(token) : null

    if (session && session.user) {
      dispatch(setUser(session.user))
    } else {
      navigate("/auth")
    }
  }, [user])

  return <>{children}</>
}

export default AuthLayout
