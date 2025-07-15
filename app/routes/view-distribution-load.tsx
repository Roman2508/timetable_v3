import type { Route } from "./+types/view-distribution-load";
import ViewDistributionLoadPage from "~/pages/view-distribution-load-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Перегляд навантаження" }];
}

export default function ViewDistributionLoad() {
  return <ViewDistributionLoadPage />;
}
