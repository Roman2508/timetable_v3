import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch } from "@/store/store"
import FullPlanPage from "@/pages/full-plan-page"
import { getTeachersCategories } from "@/store/teachers/teachers-async-actions"
import { getPlanName, getPlanSubjects } from "@/store/plans/plans-async-actions"

export default function FullPlan() {
  const dispatch = useAppDispatch()

  const { id } = useParams()

  useEffect(() => {
    if (!id || isNaN(Number(id))) return

    const payload = { id: +id, semesters: "1,2,3,4,5,6,7,8" }

    dispatch(getPlanName(+id))
    dispatch(getPlanSubjects(payload))
    dispatch(getTeachersCategories())
  }, [id])

  return <FullPlanPage />
}
