import { scheduleLessonsAPI } from "~/api/schedule-lessons-api";
import type { Route } from "./+types/timetable";
import TimetablePage from "~/pages/timetable-page";
import cookie from "cookie";
import { TIMETABLE_ITEM, TIMETABLE_SEMESTER, TIMETABLE_TYPE } from "~/constants/cookies-keys";
import { useAppDispatch } from "~/store/store";
import { useLoaderData } from "react-router";
import { useRef } from "react";
import { setScheduleLessons } from "~/store/schedule-lessons/schedule-lessons-slice";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ЖБФФК | Редактор розкладу" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  const itemId = !isNaN(Number(cookies[TIMETABLE_ITEM])) ? Number(cookies[TIMETABLE_ITEM]) : null;
  const semester = !isNaN(Number(cookies[TIMETABLE_SEMESTER])) ? Number(cookies[TIMETABLE_SEMESTER]) : 1;
  const type = cookies[TIMETABLE_TYPE] ? cookies[TIMETABLE_TYPE] : "group";

  if (itemId) {
    const payload = { id: itemId, semester: semester, type: type as "group" | "teacher" | "auditory" };
    const { data: scheduleLessons } = await scheduleLessonsAPI.getLessons(payload);
    return { scheduleLessons };
  }

  return { scheduleLessons: null };
}

export default function Timetable() {
  const dispatch = useAppDispatch();
  const loaderData = useLoaderData<typeof loader>();

  const initialized = useRef(false);

  if (!initialized.current) {
    dispatch(setScheduleLessons(loaderData.scheduleLessons));
    initialized.current = true;
  }

  return <TimetablePage />;
}
