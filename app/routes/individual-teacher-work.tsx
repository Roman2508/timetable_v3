import { META_TAGS } from "~/constants/site-meta-tags"
import type { Route } from "./+types/individual-teacher-work"
import IndividualTeacherWork from "~/pages/individual-teacher-work-page"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Індивідуальний план роботи викладача" }, ...META_TAGS]
}

export default function InstructionalMaterials() {
  return <IndividualTeacherWork />
}
