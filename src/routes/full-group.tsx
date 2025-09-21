import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { groupsAPI } from "@/api/groups-api"
import { useAppDispatch } from "@/store/store"
import type { Route } from "./+types/full-group"
import FullPlanPage from "@/pages/full-group-page"
import { META_TAGS } from "@/constants/site-meta-tags"
import { setGroup } from "@/store/groups/groups-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Групи" }, ...META_TAGS]
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const groupId = params.id

  const isUpdate = !isNaN(Number(groupId))

  if (isUpdate) {
    const { data } = await groupsAPI.getGroup(groupId)
    return { group: data, groupId }
  }

  return { groupId }
}

export default function FullGroup() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    if (!loaderData.group) return
    dispatch(setGroup(loaderData.group))
  }, [loaderData])

  return <FullPlanPage groupId={loaderData.groupId} />
}
