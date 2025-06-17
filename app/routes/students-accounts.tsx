import type { Route } from "./+types/students-accounts";

import StudentsAccountsPage from "~/pages/students-accounts-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Здобувачі освіти" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function StudentsAccounts() {
  return <StudentsAccountsPage />;
}
