import type { Route } from "./+types/teachers"
import TeachersPage from "@/pages/teachers-page"
import { META_TAGS } from "@/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Викладацький склад" }, ...META_TAGS]
}

export default function Teachers() {
  return <TeachersPage />
}
