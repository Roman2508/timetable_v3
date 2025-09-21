import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { useAppDispatch } from "@/store/store"
import { studentsAPI } from "@/api/students-api"
import type { Route } from "./+types/full-teacher"
import FullStudentPage from "@/pages/full-student-page"
import { META_TAGS } from "@/constants/site-meta-tags"
import { setStudent } from "@/store/students/students-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Здобувачі освіти" }, ...META_TAGS]
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const studentId = params.id

  const isUpdate = !isNaN(Number(studentId))

  if (isUpdate) {
    const { data } = await studentsAPI.getById(+studentId)
    return { student: data, studentId }
  }

  return { studentId }
}

export default function FullStudent() {
  const loaderData = useLoaderData<typeof clientLoader>()

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (loaderData.student) {
      dispatch(setStudent(loaderData.student))
    } else {
      dispatch(setStudent())
    }
  }, [loaderData])

  return <FullStudentPage studentId={loaderData.studentId} />
}
