import { useLoaderData } from "react-router";

import type { Route } from "./+types/full-auditory";
import { auditoriesAPI } from "~/api/auditories-api";
import FullAuditory from "~/pages/full-auditory-page";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Аудиторії" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const auditoryId = params.id;

  const isUpdate = !isNaN(Number(auditoryId));

  if (isUpdate) {
    const { data } = await auditoriesAPI.getAuditory(auditoryId);
    return { auditory: data, auditoryId };
  }

  return { auditoryId };
}

export default function FullPlan() {
  const { auditoryId, auditory } = useLoaderData() as { auditoryId: string; auditory: AuditoriesTypes };
  return <FullAuditory auditoryId={auditoryId} auditory={auditory} />;
}
