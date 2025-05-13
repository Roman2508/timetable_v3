import type { Route } from "./+types/full-group";
import FullPlanPage from "~/pages/full-group/full-group-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Групи" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const groupId = params.id;

  // get group data from API
  // return group data

  return { groupId };
}

export default function FullPlan() {
  return <FullPlanPage />;
}
