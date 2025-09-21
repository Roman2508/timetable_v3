import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { plansAPI } from "@/api/plans-api"
import type { Route } from "./+types/home"
import { useAppDispatch } from "@/store/store"
import { teachersAPI } from "@/api/teachers-api"
import FullPlanPage from "@/pages/full-plan-page"
import { META_TAGS } from "@/constants/site-meta-tags"
import { planSubjectsAPI } from "@/api/plan-subjects-api"
import { setPlan, setPlanSubjects } from "@/store/plans/plans-slice"
import { setTeacherCategories } from "@/store/teachers/teachers-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, ...META_TAGS]
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const planId = (params as { id: string }).id

  if (!planId) {
    throw new Response("Invalid plan ID", { status: 400 })
  }

  const payload = { id: Number(planId), semesters: "1,2,3,4,5,6,7,8" }
  const { data: planSubjects } = await planSubjectsAPI.getPlanSubjects(payload)
  const { data: plan } = await plansAPI.getPlanName(Number(planId))

  const { data: teachersCategories } = await teachersAPI.getTeachersCategories()

  return { planSubjects, plan, teachersCategories }
}

export default function FullPlan() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setPlan(loaderData.plan))
    dispatch(setPlanSubjects(loaderData.planSubjects))
    dispatch(setTeacherCategories(loaderData.teachersCategories))
  }, [loaderData])

  return <FullPlanPage />
}
