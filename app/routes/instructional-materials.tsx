import { META_TAGS } from "~/constants/site-meta-tags"
import type { Route } from "./+types/instructional-materials"
import InstructionalMaterialsPage from "~/pages/instructional-materials-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Навчально-методичні комплекси" }, ...META_TAGS]
}

export default function InstructionalMaterials() {
  return <InstructionalMaterialsPage />
}
