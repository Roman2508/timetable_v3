import { useLoaderData } from "react-router";

import { teachersAPI } from "~/api/teachers-api";
import type { Route } from "./+types/full-teacher";
import FullTeacher from "~/pages/full-teacher-page";
import { auditoriesAPI } from "~/api/auditories-api";
import type { TeachersType } from "~/store/teachers/teachers-types";
import type { AuditoriesTypes } from "~/store/auditories/auditories-types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Викладачі" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const teacherId = params.id;

  const isUpdate = !isNaN(Number(teacherId));

  if (isUpdate) {
    const { data } = await teachersAPI.getTeacher(teacherId);
    return { teacher: data, teacherId };
  }

  return { teacherId };
}

export default function FullPlan() {
  const { teacherId, teacher } = useLoaderData() as { teacherId: string; teacher: TeachersType };
  return <FullTeacher teacherId={teacherId} teacher={teacher} />;
}
