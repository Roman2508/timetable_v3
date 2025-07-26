import { teachersAPI } from "~/api/teachers-api";
import type { AppStore } from "~/store/app-types";
import { setTeacherCategories } from "~/store/teachers/teachers-slice";
import { parseBoolean, parseEnum, parseIdsFromCookie } from "~/helpers/cookie-parsers";
import { setTeacherFilters, setTeacherOrder, setTeacherStatus } from "~/store/general/general-slice";
import { TEACHER_FILTERS, TEACHER_SORT_KEY, TEACHER_SORT_TYPE, TEACHER_STATUS } from "~/constants/cookies-keys";

export async function preloadTeachers(store: AppStore, cookies: Record<string, string | undefined>) {
  const { data: categories } = await teachersAPI.getTeachersCategories();
  store.dispatch(setTeacherCategories(categories));

  const filters = parseIdsFromCookie(cookies[TEACHER_FILTERS]);
  store.dispatch(setTeacherFilters(filters));

  const status = parseEnum(cookies[TEACHER_STATUS], ["Всі", "Активний", "Архів"], "Всі");
  store.dispatch(setTeacherStatus(status));

  const sortKey = cookies[TEACHER_SORT_KEY];
  const sortDesc = parseBoolean(cookies[TEACHER_SORT_TYPE]);

  if (sortKey) {
    store.dispatch(setTeacherOrder({ id: sortKey, desc: sortDesc }));
  }
}
