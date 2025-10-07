import { useEffect } from "react"

import { useAppDispatch } from "@/store/store"
import FullPlanPage from "@/pages/distribution-page"
import { getGroupCategories } from "@/store/groups/groups-async-actions"
import { getTeachersCategories } from "@/store/teachers/teachers-async-actions"

export default function Distribution() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getGroupCategories())
    dispatch(getTeachersCategories())
  }, [])

  return <FullPlanPage />
}
