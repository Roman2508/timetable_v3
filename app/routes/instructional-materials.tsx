import { useLoaderData } from "react-router";

import type { Route } from "./+types/instructional-materials";
import type { StudentType } from "~/store/students/students-types";
import InstructionalMaterialsPage from "~/pages/instructional-materials-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Здобувачі освіти" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

// export async function loader({ params }: Route.LoaderArgs) {
// }

export default function InstructionalMaterials() {
  return <InstructionalMaterialsPage />;
}
