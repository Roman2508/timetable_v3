import type { Route } from "./+types/teachers-report"
import { META_TAGS } from "~/constants/site-meta-tags"
import TeachersReportPage from "~/pages/teachers-report-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Звіт викладача" }, ...META_TAGS]
}

export default function TeachersReport() {
  return <TeachersReportPage />
}
