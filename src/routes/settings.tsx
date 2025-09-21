import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { authAPI } from "@/api/auth-api"
import { rolesAPI } from "@/api/roles-api"
import type { Route } from "./+types/settings"
import { useAppDispatch } from "@/store/store"
import { settingsAPI } from "@/api/settings-api"
import SettingsPage from "@/pages/settings-page"
import { setUsers } from "@/store/auth/auth-slice"
import { setRoles } from "@/store/roles/roles-slice"
import { META_TAGS } from "@/constants/site-meta-tags"
import { setSettings } from "@/store/settings/settings-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Налаштування" }, ...META_TAGS]
}

export const shouldRevalidate = () => {
  return false // Отключаем повторный вызов лоадера при навигации
}

export async function clientLoader() {
  const { data: roles } = await rolesAPI.getAll()
  const { data: users } = await authAPI.getUsers({})
  const { data: settings } = await settingsAPI.getSettings()
  return { roles, users, settings }
}

export default function Settings() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    if (loaderData.roles) dispatch(setRoles(loaderData.roles))
    if (loaderData.users) dispatch(setUsers(loaderData.users[0]))
    if (loaderData.settings) dispatch(setSettings(loaderData.settings))
  }, [loaderData])

  return <SettingsPage />
}
