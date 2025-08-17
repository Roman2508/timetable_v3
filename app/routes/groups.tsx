import type { Route } from "./+types/groups"
import GroupsPage from "~/pages/groups-page"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Групи" }, ...META_TAGS]
}

export default function Groups() {
  return <GroupsPage />
}
