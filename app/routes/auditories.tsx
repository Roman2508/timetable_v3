import type { Route } from "./+types/auditories"
import AuditoriesPage from "~/pages/auditories-page"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Аудиторії" }, ...META_TAGS]
}

export default function Teachers() {
  return <AuditoriesPage />
}
