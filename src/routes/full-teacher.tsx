import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch } from "@/store/store"
import FullTeacherPage from "@/pages/full-teacher-page"
import { getTeacher } from "@/store/teachers/teachers-async-actions"

export default function FullTeacher() {
  const dispatch = useAppDispatch()

  const { id } = useParams()

  useEffect(() => {
    if (!id || isNaN(Number(id))) return
    dispatch(getTeacher(+id))
  }, [id])

  return <FullTeacherPage teacherId={id} />
}
