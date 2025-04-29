import type { Route } from "./+types/streams";

import StreamsPage from "~/pages/streams/streams-page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Потоки" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Teachers() {
  return <StreamsPage />;
}
