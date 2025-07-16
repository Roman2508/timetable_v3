import cookie from "cookie";

import AuthPage from "~/pages/auth-page";
import type { Route } from "./+types/auth";
import { authAPI } from "~/api/auth-api";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Вхід" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  if (!cookies.token) return;

  const { data: user } = await authAPI.getMe(cookies.token);

  if (!user) return;

  redirect("/");
}

export default function Auth() {
  return <AuthPage />;
}
