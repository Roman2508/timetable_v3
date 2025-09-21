import { useEffect } from "react"
import { useLoaderData } from "react-router"

import { useAppDispatch } from "@/store/store"
import type { Route } from "./+types/full-auditory"
import { auditoriesAPI } from "@/api/auditories-api"
import { META_TAGS } from "@/constants/site-meta-tags"
import FullAuditoryPage from "@/pages/full-auditory-page"
import { setAuditory } from "@/store/auditories/auditories-slise"
import type { AuditoriesTypes } from "@/store/auditories/auditories-types"

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Аудиторії" }, ...META_TAGS]
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const auditoryId = params.id

  const isUpdate = !isNaN(Number(auditoryId))

  if (isUpdate) {
    const { data } = await auditoriesAPI.getAuditory(auditoryId)
    return { auditory: data, auditoryId }
  }

  return { auditoryId }
}

export default function FullAuditory() {
  const loaderData = useLoaderData() as { auditoryId: string; auditory: AuditoriesTypes }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setAuditory(loaderData.auditory))
  }, [loaderData])

  return <FullAuditoryPage auditoryId={loaderData.auditoryId} />
}
