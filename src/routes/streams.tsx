import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { useAppDispatch } from "@/store/store"
import { streamsAPI } from "@/api/streams-api"
import StreamsPage from "@/pages/streams-page"
import { setStreams } from "@/store/streams/streams-slice"

export async function loader() {
  const { data: streams } = await streamsAPI.getStreams()
  return { streams }
}

export default function Streams() {
  const dispatch = useAppDispatch()
  const loaderData = useLoaderData<typeof loader>()

  useEffect(() => {
    console.log("loaderData", loaderData, loaderData?.streams)
    if (loaderData?.streams) {
      dispatch(setStreams(loaderData.streams))
    }
  }, [loaderData])

  return <StreamsPage />
}
