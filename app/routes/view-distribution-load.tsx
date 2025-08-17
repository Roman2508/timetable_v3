import { META_TAGS } from "~/constants/site-meta-tags"
import type { Route } from "./+types/view-distribution-load"
import ViewDistributionLoadPage from "~/pages/view-distribution-load-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Перегляд навантаження" }, ...META_TAGS]
}

export default function ViewDistributionLoad() {
  return <ViewDistributionLoadPage />
}
