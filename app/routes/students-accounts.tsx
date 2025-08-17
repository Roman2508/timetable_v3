import { META_TAGS } from "~/constants/site-meta-tags"
import type { Route } from "./+types/students-accounts"

import StudentsAccountsPage from "~/pages/students-accounts-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Здобувачі освіти" }, ...META_TAGS]
}

export default function StudentsAccounts() {
  return <StudentsAccountsPage />
}
