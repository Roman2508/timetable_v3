import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { authAPI } from "~/api/auth-api"
import { rolesAPI } from "~/api/roles-api"
import type { Route } from "./+types/settings"
import { useAppDispatch } from "~/store/store"
import SettingsPage from "~/pages/settings-page"
import { setUsers } from "~/store/auth/auth-slice"
import { setRoles } from "~/store/roles/roles-slice"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Налаштування" }, ...META_TAGS]
}

export async function clientLoader() {
  const { data: roles } = await rolesAPI.getAll()
  const { data: users } = await authAPI.getUsers({})
  return { roles, users }
}

export default function Settings() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setRoles(loaderData.roles))
    dispatch(setUsers(loaderData.users[0]))
  }, [loaderData])

  return <SettingsPage />
}
