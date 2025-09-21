import type { Route } from "./+types/profile"
import ProfilePage from "@/pages/profile-page"
import { META_TAGS } from "@/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Профіль" }, ...META_TAGS]
}

export default function Profile() {
  return <ProfilePage />
}
