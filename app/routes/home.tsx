import HomePage from "~/pages/home-page"
import type { Route } from "./+types/home"
import { META_TAGS } from "~/constants/site-meta-tags"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, ...META_TAGS]
}

export default function Home() {
  return <HomePage />
}
