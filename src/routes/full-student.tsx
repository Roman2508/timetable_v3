import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch } from "@/store/store"
import FullStudentPage from "@/pages/full-student-page"
import { setStudent } from "@/store/students/students-slice"
import { getStudent } from "@/store/students/students-async-actions"

export default function FullStudent() {
  const dispatch = useAppDispatch()

  const { id } = useParams()

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      dispatch(setStudent())
    } else {
      dispatch(getStudent(+id))
    }
  }, [id])

  return <FullStudentPage studentId={id} />
}
