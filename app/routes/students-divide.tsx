import type { Route } from "./+types/students-accounts";

import StudentsDividePage from "~/pages/students-divide/students-divide-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Поділ на підгрупи" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function StudentsAccounts() {
  return <StudentsDividePage />;
}
