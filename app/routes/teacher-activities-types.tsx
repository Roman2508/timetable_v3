import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { useAppDispatch } from "~/store/store"
import { META_TAGS } from "~/constants/site-meta-tags"
import { teacherProfileAPI } from "~/api/teacher-profile-api"
import type { Route } from "./+types/teacher-activities-types"
import TeacherActivitiesTypesPage from "~/pages/teacher-activities-types-page"
import { setIndividualWork } from "~/store/teacher-profile/teacher-profile-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Види педагогічної діяльності" }, ...META_TAGS]
}

export async function clientLoader({}: Route.LoaderArgs) {
  const { data } = await teacherProfileAPI.getIndividualTeacherWork()
  return { individualWorkPlan: data }
}

export default function TeacherActivitiesTypes() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setIndividualWork(loaderData.individualWorkPlan))
  }, [loaderData])

  return <TeacherActivitiesTypesPage />
}
