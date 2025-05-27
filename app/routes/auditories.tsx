import type { Route } from "./+types/auditories";
import AuditoriesPage from "~/pages/auditories/auditories-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Аудиторії" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Teachers() {
  return <AuditoriesPage />;
}
