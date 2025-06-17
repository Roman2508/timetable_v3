import { useLoaderData } from "react-router";

import type { Route } from "./+types/full-group";
import FullPlanPage from "~/pages/full-group-page";
import { groupsAPI } from "~/api/groups-api";
import type { GroupsType } from "~/store/groups/groups-types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Групи" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const groupId = params.id;

  const isUpdate = !isNaN(Number(groupId));

  if (isUpdate) {
    const { data } = await groupsAPI.getGroup(groupId);
    return { group: data, groupId };
  }

  return { groupId };
}

export default function FullPlan() {
  const { groupId, group } = useLoaderData() as { groupId: string; group: GroupsType };
  return <FullPlanPage groupId={groupId} group={group} />;
}
