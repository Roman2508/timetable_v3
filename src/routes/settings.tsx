import { useEffect } from "react"

import { useAppDispatch } from "@/store/store"
import SettingsPage from "@/pages/settings-page"
import { getUsers } from "@/store/auth/auth-async-actions"
import { getAllRoles } from "@/store/roles/roles-async-actions"
import { getSettings } from "@/store/settings/settings-async-actions"

export default function Settings() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllRoles())
    dispatch(getUsers({}))
    dispatch(getSettings(1))
  }, [])

  return <SettingsPage />
}
