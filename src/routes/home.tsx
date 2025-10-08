import { useEffect } from "react"

import HomePage from "@/pages/home-page"
import { useAppDispatch } from "@/store/store"
import { getSettings } from "@/store/settings/settings-async-actions"

export default function Home() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSettings(1))
    // if (loaderData.roles) dispatch(setRoles(loaderData.roles))
    // if (loaderData.users) dispatch(setUsers(loaderData.users[0]))
  }, [])

  return <HomePage />
}
