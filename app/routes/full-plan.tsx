import { planSubjectsAPI } from "~/api/plan-subjects-api";
import type { Route } from "./+types/home";
import FullPlanPage from "~/pages/full-plan/full-plan-page";
import { useLoaderData } from "react-router";
import type { PlanSubjectType } from "~/store/plans/plans-types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const planId = params.id;

  const payload = { id: Number(planId), semesters: "1,2,3,4,5,6" };
  const { data: planSubjects } = await planSubjectsAPI.getPlanSubjects(payload);

  return { planSubjects };
}

export default function FullPlan() {
  const { planSubjects } = useLoaderData() as { planSubjects: PlanSubjectType[] };
  return <FullPlanPage planSubjects={planSubjects} />;
}
