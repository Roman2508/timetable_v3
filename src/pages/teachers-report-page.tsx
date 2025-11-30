import { useSelector } from "react-redux"
import { useEffect, useMemo, useState, type FC } from "react"

import { customDayjs } from "@/lib/dayjs"
import { useAppDispatch } from "@/store/store"
import { TEMPORARY_TEACHER_ID } from "@/constants"
import { Input } from "@/components/ui/common/input"
import { Accordion } from "@/components/ui/common/accordion"
import { sortItemsByKey } from "@/helpers/sort-items-by-key"
import { InputSearch } from "@/components/ui/custom/input-search"
import LoadingSpinner from "@/components/ui/icons/loading-spinner"
import { RootContainer } from "@/components/layouts/root-container"
import type { TeacherReportType } from "@/store/teacher-profile/teacher-profile-types"
import TeachersReportItem from "@/components/features/pages/teachers-report/teachers-report-item"
import ExportTeachersReport from "@/components/features/pages/teachers-report/export-teachers-report"
import { clearTeacherReports, teacherProfileSelector } from "@/store/teacher-profile/teacher-profile-slice"
import { getTeacherLoadById, getTeacherReport } from "@/store/teacher-profile/teacher-profile-async-actions"

const TeacherReportPage: FC = () => {
  const dispatch = useAppDispatch()

  const { report } = useSelector(teacherProfileSelector)

  const [doneHours, setDoneHours] = useState(0)
  const [globalSearch, setGlobalSearch] = useState("")
  const [showedYear, setShowedYear] = useState(customDayjs().year())

  useEffect(() => {
    dispatch(getTeacherLoadById(TEMPORARY_TEACHER_ID))
    dispatch(clearTeacherReports())
    dispatch(getTeacherReport({ year: showedYear, id: TEMPORARY_TEACHER_ID }))
  }, [showedYear])

  useEffect(() => {
    if (!report) return
    const doneActivities = report.filter((el) => el.status)
    const doneHours = doneActivities.reduce((acc, cur) => Number(cur.hours) + acc, 0)
    setDoneHours(doneHours)
  }, [report])

  const filtredReport = useMemo(
    () => (report || []).filter((rep) => rep.individualWork.name.toLowerCase().includes(globalSearch.toLowerCase())),
    [report, globalSearch],
  )

  return (
    <RootContainer classNames="relative">
      <h1 className="text-center font-bold text-3xl tracking-tight mb-4">Види педагогічної діяльності</h1>

      <div className="flex justify-center items-center gap-2 mb-4">
        <p>Звіт за</p>
        <Input
          className="w-18 px-2 bg-white"
          type="number"
          value={showedYear}
          onChange={(e) => {
            setShowedYear(Number(e.target.value))
          }}
        />
        <p>- {showedYear + 1} н.р.</p>
      </div>

      <div className="flex w-full gap-4 mb-6">
        <InputSearch
          className="flex-1"
          value={globalSearch}
          placeholder="Пошук..."
          onChange={(e) => setGlobalSearch(e.target.value)}
        />

        <ExportTeachersReport showedYear={showedYear} />
      </div>

      <h2 className="text-center font-semibold text-md mb-8">Всього виконано за н.р. {doneHours} годин.</h2>

      {!report ? (
        <LoadingSpinner />
      ) : !report.length ? (
        <p className="font-mono my-10 text-center">Не знайдено</p>
      ) : (
        <Accordion type="multiple">
          {sortItemsByKey(filtredReport, "id").map((report: TeacherReportType) => {
            return <TeachersReportItem key={report.id} report={report} />
          })}
        </Accordion>
      )}
    </RootContainer>
  )
}

export default TeacherReportPage
