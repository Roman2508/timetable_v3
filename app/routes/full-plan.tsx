import type { Route } from "./+types/home";
import FullPlanPage from "~/pages/full-plan/full-plan";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function FullPlan() {
  return <FullPlanPage />;
}
