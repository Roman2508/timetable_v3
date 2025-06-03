import { useRef } from "react";
import { useLoaderData } from "react-router";

import { plansAPI } from "~/api/plans-api";
import type { Route } from "./+types/home";
import { useAppDispatch } from "~/store/store";
import { planSubjectsAPI } from "~/api/plan-subjects-api";
import FullPlanPage from "~/pages/full-plan/full-plan-page";
import { setPlan, setPlanSubjects } from "~/store/plans/plans-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Головна" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const planId = params.id;

  if (!planId) {
    throw new Response("Invalid plan ID", { status: 400 });
  }

  const payload = { id: Number(planId), semesters: "1,2,3,4,5,6" };
  const { data: planSubjects } = await planSubjectsAPI.getPlanSubjects(payload);
  const { data: plan } = await plansAPI.getPlanName(Number(planId));

  return { planSubjects, plan };
}

export default function FullPlan() {
  const dispatch = useAppDispatch();
  const loaderData = useLoaderData<typeof loader>();

  const initialized = useRef(false);
  
  if (!initialized.current) {
    dispatch(setPlan(loaderData.plan));
    dispatch(setPlanSubjects(loaderData.planSubjects));
    initialized.current = true;
  }

  return <FullPlanPage />;
}
