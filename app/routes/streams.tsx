import { useEffect } from "react"
import { useLoaderData } from "react-router"

import type { Route } from "./+types/streams"
import { useAppDispatch } from "~/store/store"
import { streamsAPI } from "~/api/streams-api"
import StreamsPage from "~/pages/streams-page"
import { META_TAGS } from "~/constants/site-meta-tags"
import { setStreams } from "~/store/streams/streams-slice"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Потоки" }, ...META_TAGS]
}

export async function clientLoader({}: Route.LoaderArgs) {
  const { data: streams } = await streamsAPI.getStreams()
  return { streams }
}

export default function Teachers() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof clientLoader>()

  useEffect(() => {
    dispatch(setStreams(loaderData.streams))
  }, [loaderData])

  return <StreamsPage />
}
