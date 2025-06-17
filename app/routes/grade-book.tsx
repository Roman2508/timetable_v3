import type { Route } from "./+types/home";
import GradeBookPage from "~/pages/grade-book-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Електронний журнал" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function GradeBook() {
  return <GradeBookPage />;
}
