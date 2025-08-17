import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { useAppDispatch } from "~/store/store"
import { teachersAPI } from "~/api/teachers-api"
import type { Route } from "./+types/full-teacher"
import FullTeacher from "~/pages/full-teacher-page"
import { META_TAGS } from "~/constants/site-meta-tags"
import { setTeacher } from "~/store/teachers/teachers-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Викладачі" }, ...META_TAGS]
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const teacherId = params.id

  const isUpdate = !isNaN(Number(teacherId))

  if (isUpdate) {
    const { data } = await teachersAPI.getTeacher(teacherId)
    return { teacher: data, teacherId }
  }

  return { teacherId }
}

export default function FullPlan() {
  const dispatch = useAppDispatch()

  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    if (!loaderData.teacher) return
    dispatch(setTeacher(loaderData.teacher))
  }, [loaderData])

  return <FullTeacher teacherId={loaderData.teacherId} />
}
