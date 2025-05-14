import type { Route } from "./+types/auth";
import AuthPage from "~/pages/auth/auth-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Вхід" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Auth() {
  return <AuthPage />;
}
