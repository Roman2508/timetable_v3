import type { Route } from "./+types/home"
import GradeBookPage from "~/pages/grade-book-page"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Електронний журнал" }, ...META_TAGS]
}

export default function GradeBook() {
  return <GradeBookPage />
}
