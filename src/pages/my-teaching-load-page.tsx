import { useSelector } from "react-redux"
import { useEffect, useMemo, useState, type FC } from "react"

import { useAppDispatch } from "@/store/store"
import { TEMPORARY_TEACHER_ID } from "@/constants"
import { Card } from "@/components/ui/common/card"
import { UserRoles } from "@/store/auth/auth-types"
import { authSelector } from "@/store/auth/auth-slice"
import { LoadingStatusTypes } from "@/store/app-types"
import type { GroupLoadType } from "@/store/groups/groups-types"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { RootContainer } from "@/components/layouts/root-container"
import { PageTopTitle } from "@/components/features/page-top-title"
import { Table, TableCell, TableRow } from "@/components/ui/common/table"
import splitWorkloadBySemesters from "@/helpers/split-workload-by-semesters"
import { teacherProfileSelector } from "@/store/teacher-profile/teacher-profile-slice"
import { getTeacherLoadById } from "@/store/teacher-profile/teacher-profile-async-actions"

const MyTeachingLoadPage: FC = () => {
  const dispatch = useAppDispatch()

  const { user } = useSelector(authSelector)
  const { workload, loadingStatus } = useSelector(teacherProfileSelector)

  const [firstSemesterLessons, setFirstSemesterLessons] = useState<GroupLoadType[]>([])
  const [secondSemesterLessons, setSecondSemesterLessons] = useState<GroupLoadType[]>([])

  const handleSemesterLessons = (load: GroupLoadType[]) => {
    const { firstSemesterLessons, secondSemesterLessons } = splitWorkloadBySemesters(load)

    setFirstSemesterLessons(firstSemesterLessons)
    setSecondSemesterLessons(secondSemesterLessons)
  }

  useEffect(() => {
    if (workload) {
      handleSemesterLessons(workload)
      return
    }

    const fetchData = async () => {
      /*!user || !user.teacher  || !user.role.includes(UserRoles.TEACHER) */
      if (false) {
        return
      }

      const { payload } = await dispatch(getTeacherLoadById(TEMPORARY_TEACHER_ID))
      // const { payload } = await dispatch(getTeacherLoadById(user.teacher.id));
      const workload = payload as GroupLoadType[]
      handleSemesterLessons(workload)
    }

    fetchData()
  }, [])

  const firstSemesterTotalHours = useMemo(
    () => firstSemesterLessons.reduce((total, current) => total + current.hours, 0),
    [firstSemesterLessons],
  )

  const secondSemesterTotalHours = useMemo(
    () => secondSemesterLessons.reduce((total, current) => total + current.hours, 0),
    [secondSemesterLessons],
  )
  console.log(user)
  return (
    <RootContainer classNames="relative">
      <PageTopTitle title="Моє педагогічне навантаження" classNames="text-center" />

      {loadingStatus === LoadingStatusTypes.LOADING ? (
        <LoadingSpinner />
      ) : false ? (
        // ) : user && !user.teacher ? (
        <p className="font-mono my-10 text-center">Ця сторінка доступна лише для викладачів</p>
      ) : (
        <Card className="p-2 mt-4">
          <Table>
            <TableRow>
              <TableCell className="font-mono uppercase">№</TableCell>
              <TableCell className="font-mono uppercase">Група</TableCell>
              <TableCell className="font-mono uppercase">Дисципліна</TableCell>
              <TableCell className="font-mono uppercase">Група/Підгрупа</TableCell>
              <TableCell className="font-mono uppercase">Вид заняття</TableCell>
              <TableCell className="font-mono uppercase text-right">Години</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={6} className="text-center font-bold">
                Семестр 1
              </TableCell>
            </TableRow>

            {firstSemesterLessons.map((lesson: GroupLoadType, index) => {
              const subgroup = lesson.subgroupNumber ? `Підгр.${lesson.subgroupNumber}` : "Вся група"
              return (
                <TableRow key={lesson.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lesson.group.name}</TableCell>
                  <TableCell>{lesson.name}</TableCell>
                  <TableCell>{subgroup}</TableCell>
                  <TableCell>{lesson.typeRu}</TableCell>
                  <TableCell className="text-right">{lesson.hours}</TableCell>
                </TableRow>
              )
            })}
            {!firstSemesterLessons.length && (
              <TableRow>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={5} className="font-bold">
                Всього за 1 семестр
              </TableCell>
              <TableCell className="font-bold text-right">{firstSemesterTotalHours}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={6} className="text-center font-bold">
                Семестр 2
              </TableCell>
            </TableRow>

            {secondSemesterLessons.map((lesson: GroupLoadType, index) => {
              const subgroup = lesson.subgroupNumber ? `Підгр.${lesson.subgroupNumber}` : "Вся група"
              return (
                <TableRow key={lesson.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lesson.group.name}</TableCell>
                  <TableCell>{lesson.name}</TableCell>
                  <TableCell>{subgroup}</TableCell>
                  <TableCell>{lesson.typeRu}</TableCell>
                  <TableCell className="text-right">{lesson.hours}</TableCell>
                </TableRow>
              )
            })}
            {!secondSemesterLessons.length && (
              <TableRow>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={5} className="font-bold">
                Всього за 2 семестр
              </TableCell>
              <TableCell className="font-bold text-right">{secondSemesterTotalHours}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={5} className="font-bold">
                Всього за рік
              </TableCell>
              <TableCell className="font-bold text-right">
                {firstSemesterTotalHours + secondSemesterTotalHours}
              </TableCell>
            </TableRow>
          </Table>
        </Card>
      )}
    </RootContainer>
  )
}

export default MyTeachingLoadPage
