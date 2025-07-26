import {
  TIMETABLE_WEEK,
  TIMETABLE_ITEM,
  TIMETABLE_TYPE,
  TIMETABLE_CATEGORY,
  TIMETABLE_SEMESTER,
} from "~/constants/cookies-keys";
import type { AppStore } from "~/store/app-types";
import { parseNumber } from "~/helpers/cookie-parsers";
import { setTimetableData } from "~/store/general/general-slice";

export async function preloadTimetable(store: AppStore, cookies: Record<string, string | undefined>) {
  const semester = parseNumber(cookies[TIMETABLE_SEMESTER]);
  const week = parseNumber(cookies[TIMETABLE_WEEK]);
  const item = parseNumber(cookies[TIMETABLE_ITEM]);
  const category = parseNumber(cookies[TIMETABLE_CATEGORY]);
  const type = cookies[TIMETABLE_TYPE] ?? null;

  store.dispatch(setTimetableData({ semester, week, item, category, type }));
}
