import type { AppStore } from "~/store/app-types";
import { auditoriesAPI } from "~/api/auditories-api";
import { setAuditoryCategories } from "~/store/auditories/auditories-slise";
import { parseBoolean, parseEnum, parseIdsFromCookie } from "~/helpers/cookie-parsers";
import { setAuditoryFilters, setAuditoryOrder, setAuditoryStatus } from "~/store/general/general-slice";
import { AUDITORY_FILTERS, AUDITORY_SORT_KEY, AUDITORY_SORT_TYPE, AUDITORY_STATUS } from "~/constants/cookies-keys";

export async function preloadAuditories(store: AppStore, cookies: Record<string, string | undefined>) {
  const { data: categories } = await auditoriesAPI.getAuditoryCategories();
  store.dispatch(setAuditoryCategories(categories));

  const filters = parseIdsFromCookie(cookies[AUDITORY_FILTERS]);
  store.dispatch(setAuditoryFilters(filters));

  const status = parseEnum(cookies[AUDITORY_STATUS], ["Всі", "Активний", "Архів"], "Всі");
  store.dispatch(setAuditoryStatus(status));

  const sortKey = cookies[AUDITORY_SORT_KEY];
  const sortDesc = parseBoolean(cookies[AUDITORY_SORT_TYPE]);

  if (sortKey) {
    store.dispatch(setAuditoryOrder({ id: sortKey, desc: sortDesc }));
  }
}
