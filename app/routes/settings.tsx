import type { Route } from "./+types/settings";
import SettingsPage from "~/pages/settings-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Налаштування" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Settings() {
  return <SettingsPage />;
}
