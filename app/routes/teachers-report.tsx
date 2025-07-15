import type { Route } from "./+types/teachers-report";
import TeachersReportPage from "~/pages/teachers-report-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Звіт викладача" }];
}

export default function TeachersReport() {
  return <TeachersReportPage />;
}
