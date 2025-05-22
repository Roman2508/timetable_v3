import { useLoaderData } from "react-router";

import type { Route } from "./+types/full-group";
import FullPlanPage from "~/pages/full-group/full-group-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Групи" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const groupId = params.id;

  return { groupId };
}

export default function FullPlan() {
  const { groupId } = useLoaderData();
  return <FullPlanPage groupId={groupId} />;
}
