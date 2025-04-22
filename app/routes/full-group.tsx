import type { Route } from "./+types/full-group";
import FullPlanPage from "~/pages/full-group/full-group";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function FullPlan() {
  return <FullPlanPage />;
}
