import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch } from "@/store/store"
import FullGroupPage from "@/pages/full-group-page"
import { getGroup } from "@/store/groups/groups-async-actions"

export default function FullGroup() {
  const dispatch = useAppDispatch()

  const { id } = useParams()

  useEffect(() => {
    if (!id || isNaN(Number(id))) return
    dispatch(getGroup(id))
  }, [id])

  return <FullGroupPage groupId={id} />
}
