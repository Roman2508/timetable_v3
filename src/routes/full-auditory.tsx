import { useEffect } from "react"
import { useParams } from "react-router"

import { useAppDispatch } from "@/store/store"
import FullAuditoryPage from "@/pages/full-auditory-page"
import { getAuditory } from "@/store/auditories/auditories-async-actions"

export default function FullAuditory() {
  const dispatch = useAppDispatch()

  const { id } = useParams()

  useEffect(() => {
    if (!id || isNaN(Number(id))) return
    dispatch(getAuditory(id))
  }, [id])

  return <FullAuditoryPage auditoryId={id} />
}
