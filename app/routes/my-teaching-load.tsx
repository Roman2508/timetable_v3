import type { Route } from "./+types/my-teaching-load";
import MyTeachingLoadPage from "~/pages/my-teaching-load-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Моє педагогічне навантаження" }];
}

export default function MyTeachingLoad() {
  return <MyTeachingLoadPage />;
}
