import type { Route } from "./+types/groups";
import GroupsPage from "~/pages/groups-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Групи" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Groups() {
  return <GroupsPage />;
}
