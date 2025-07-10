import { useLoaderData } from "react-router";

import { studentsAPI } from "~/api/students-api";
import type { Route } from "./+types/full-teacher";
import FullStudent from "~/pages/full-student-page";
import type { StudentType } from "~/store/students/students-types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЖБФФК | Здобувачі освіти" },
    { name: "description", content: "ЖИТОМИРСЬКИЙ БАЗОВИЙ ФАРМАЦЕВТИЧНИЙ ФАХОВИЙ КОЛЕДЖ ЖИТОМИРСЬКОЇ ОБЛАСНОЇ РАДИ" },
    { name: "keywords", content: "moodle, MOODLE | ЖБФФК" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const studentId = params.id;

  const isUpdate = !isNaN(Number(studentId));

  if (isUpdate) {
    const { data } = await studentsAPI.getById(+studentId);
    return { student: data, studentId };
  }

  return { studentId };
}

export default function FullPlan() {
  const { studentId, student } = useLoaderData() as { studentId: string; student: StudentType };
  return <FullStudent studentId={studentId} student={student} />;
}
