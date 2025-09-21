import { Packer } from "docx"
import { type FC } from "react"
import { useSelector } from "react-redux"

import pkg from "file-saver"
const { saveAs } = pkg

import { DocumentCreator } from "./cv-generator"
import { Button } from "@/components/ui/common/button"
import { groupLessonsByFields } from "@/helpers/group-lessons-by-fields"
import splitWorkloadBySemesters from "@/helpers/split-workload-by-semesters"
import type { TeacherReportType } from "@/store/teacher-profile/teacher-profile-types"
import { teacherProfileSelector } from "@/store/teacher-profile/teacher-profile-slice"

const splitTeacherReportsByType = (reports: TeacherReportType[]) => {
  const methodicalWork: TeacherReportType[] = []
  const scientificWork: TeacherReportType[] = []
  const organizationalWork: TeacherReportType[] = []

  reports.forEach((el) => {
    if (el.individualWork.type === "Методична робота") {
      methodicalWork.push(el)
      return
    }

    if (el.individualWork.type === "Наукова робота") {
      scientificWork.push(el)
      return
    }

    if (el.individualWork.type === "Організаційна робота") {
      organizationalWork.push(el)
    }
  })

  return { methodicalWork, scientificWork, organizationalWork }
}

interface Props {
  showedYear: number
}

const ExportTeachersReport: FC<Props> = ({ showedYear }) => {
  const { report, workload } = useSelector(teacherProfileSelector)

  const generateDocx = (): void => {
    if (!report || !workload) return

    const doneReports = report.filter((el) => el.status)

    const { firstSemesterLessons, secondSemesterLessons } = splitWorkloadBySemesters(workload)
    const { methodicalWork, scientificWork, organizationalWork } = splitTeacherReportsByType(doneReports)

    const first = groupLessonsByFields(firstSemesterLessons, { lessonName: true, groupName: true })
    const second = groupLessonsByFields(secondSemesterLessons, { lessonName: true, groupName: true })

    const documentCreator = new DocumentCreator()
    const doc = documentCreator.create(
      first,
      second,
      methodicalWork,
      scientificWork,
      organizationalWork,
      "Пташник Р.В.",
      showedYear,
    )

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "report.docx")
    })
  }

  return (
    <Button onClick={generateDocx} disabled={!report || !workload} style={{ textTransform: "initial" }}>
      Експортувати звіт в WORD
    </Button>
  )
}

export default ExportTeachersReport
