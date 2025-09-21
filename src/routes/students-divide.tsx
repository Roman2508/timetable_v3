import { META_TAGS } from "@/constants/site-meta-tags"
import type { Route } from "./+types/students-accounts"
import StudentsDividePage from "@/pages/students-divide-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Поділ на підгрупи" }, ...META_TAGS]
}

export default function StudentsDivide() {
  return <StudentsDividePage />
}
