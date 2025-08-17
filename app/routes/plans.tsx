import type { Route } from "./+types/home"
import PlansPage from "~/pages/plans-page"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Навчальні плани" }, ...META_TAGS]
}

export default function Plans() {
  return <PlansPage />
}
