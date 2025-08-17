import AuthPage from "~/pages/auth-page"
import type { Route } from "./+types/auth"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Вхід" }, ...META_TAGS]
}

export default function Auth() {
  return <AuthPage />
}
