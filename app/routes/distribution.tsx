import type { Route } from "./+types/distribution";
import FullPlanPage from "~/pages/distribution/distribution-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Розподіл навантаження" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Distribution() {
  return <FullPlanPage />;
}
