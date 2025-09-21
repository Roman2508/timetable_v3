import { useEffect } from "react"
import { useLoaderData } from "react-router"

import HomePage from "@/pages/home-page"
import { authAPI } from "@/api/auth-api"
import type { Route } from "./+types/home"
import { rolesAPI } from "@/api/roles-api"
import { useAppDispatch } from "@/store/store"
import { settingsAPI } from "@/api/settings-api"
import { setUsers } from "@/store/auth/auth-slice"
import { setRoles } from "@/store/roles/roles-slice"
import { META_TAGS } from "@/constants/site-meta-tags"
import { setSettings } from "@/store/settings/settings-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, ...META_TAGS]
}

export const shouldRevalidate = () => {
  return false
}

export async function clientLoader() {
  const { data: roles } = await rolesAPI.getAll()
  const { data: users } = await authAPI.getUsers({})
  const { data: settings } = await settingsAPI.getSettings()
  return { roles, users, settings }
}

export default function Home() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    if (!loaderData) return
    if (loaderData.roles) dispatch(setRoles(loaderData.roles))
    if (loaderData.users) dispatch(setUsers(loaderData.users[0]))
    if (loaderData.settings) dispatch(setSettings(loaderData.settings))
  }, [loaderData])

  return <HomePage />
}
