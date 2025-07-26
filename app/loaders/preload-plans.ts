import { plansAPI } from "~/api/plans-api";
import type { AppStore } from "~/store/app-types";
import { setPlanCategories } from "~/store/plans/plans-slice";
import { parseEnum, parseIdsFromCookie } from "~/helpers/cookie-parsers";
import { PLAN_EXPANDED, PLAN_FILTERS, PLAN_STATUS } from "~/constants/cookies-keys";
import { setPlanExpanded, setPlanFilters, setPlanStatus } from "~/store/general/general-slice";

export async function preloadPlans(store: AppStore, cookies: Record<string, string | undefined>) {
  const { data: categories } = await plansAPI.getPlansCategories();
  store.dispatch(setPlanCategories(categories));

  const status = parseEnum(cookies[PLAN_STATUS], ["Всі", "Активний", "Архів"], "Всі");
  store.dispatch(setPlanStatus(status));

  const filters = parseIdsFromCookie(cookies[PLAN_FILTERS]);
  store.dispatch(setPlanFilters(filters));

  const expanded = parseIdsFromCookie(cookies[PLAN_EXPANDED]);
  store.dispatch(setPlanExpanded(expanded));
}
