import { useRef } from "react";
import { useLoaderData } from "react-router";

import type { Route } from "./+types/streams";
import { useAppDispatch } from "~/store/store";
import { streamsAPI } from "~/api/streams-api";
import StreamsPage from "~/pages/streams/streams-page";
import { setStreams } from "~/store/streams/streams-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Потоки" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({}: Route.LoaderArgs) {
  const { data: streams } = await streamsAPI.getStreams();
  return { streams };
}

export default function Teachers() {
  const dispatch = useAppDispatch();
  const loaderData = useLoaderData<typeof loader>();

  const initialized = useRef(false);

  if (!initialized.current) {
    dispatch(setStreams(loaderData.streams));
    initialized.current = true;
  }

  return <StreamsPage />;
}
