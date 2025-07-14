import { useRef } from "react";
import { useLoaderData } from "react-router";

import { useAppDispatch } from "~/store/store";
import { teacherProfileAPI } from "~/api/teacher-profile-api";
import type { Route } from "./+types/teacher-activities-types";
import TeacherActivitiesTypesPage from "~/pages/teacher-activities-types-page";
import { setIndividualWork } from "~/store/teacher-profile/teacher-profile-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Види педагогічної діяльності" }];
}

export async function loader({}: Route.LoaderArgs) {
  const { data } = await teacherProfileAPI.getIndividualTeacherWork();
  return { individualWorkPlan: data };
}

export default function TeacherActivitiesTypes() {
  const dispatch = useAppDispatch();
  const loaderData = useLoaderData<typeof loader>();

  const initialized = useRef(false);

  if (!initialized.current) {
    dispatch(setIndividualWork(loaderData.individualWorkPlan));
    initialized.current = true;
  }

  return <TeacherActivitiesTypesPage />;
}
