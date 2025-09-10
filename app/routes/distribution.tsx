import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { groupsAPI } from "~/api/groups-api"
import { useAppDispatch } from "~/store/store"
import { teachersAPI } from "~/api/teachers-api"
import type { Route } from "./+types/distribution"
import FullPlanPage from "~/pages/distribution-page"
import { META_TAGS } from "~/constants/site-meta-tags"
import { setGroupCategories } from "~/store/groups/groups-slice"
import { setTeacherCategories } from "~/store/teachers/teachers-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Розподіл навантаження" }, ...META_TAGS]
}

export async function clientLoader({}: Route.LoaderArgs) {
  const { data: groupCategories } = await groupsAPI.getGroupsCategories()
  const { data: teacherCategories } = await teachersAPI.getTeachersCategories()

  return { groupCategories, teacherCategories }
}

export default function Distribution() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setGroupCategories(loaderData.groupCategories))
    dispatch(setTeacherCategories(loaderData.teacherCategories))
  }, [loaderData])

  return <FullPlanPage />
}
