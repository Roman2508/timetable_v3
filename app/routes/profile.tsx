import type { Route } from "./+types/profile";
import ProfilePage from "~/pages/profile/profile-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Профіль" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function GradeBook() {
  return <ProfilePage />;
}
