import { useEffect } from "react"

import { useAppDispatch } from "@/store/store"
import TeacherActivitiesTypesPage from "@/pages/teacher-activities-types-page"
import { getIndividualTeacherWork } from "@/store/teacher-profile/teacher-profile-async-actions"



export default function TeacherActivitiesTypes() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getIndividualTeacherWork())
  }, [])

  return <TeacherActivitiesTypesPage />
}
