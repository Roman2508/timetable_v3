import AuthPage from "~/pages/auth-page";
import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Вхід" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Auth() {
  return <AuthPage />;
}
