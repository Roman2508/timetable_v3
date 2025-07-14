import { useLoaderData } from "react-router";

import type { Route } from "./+types/individual-teacher-work";
import IndividualTeacherWork from "~/pages/individual-teacher-work-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Індивідуальний план роботи викладача" }];
}

export default function InstructionalMaterials() {
  return <IndividualTeacherWork />;
}
