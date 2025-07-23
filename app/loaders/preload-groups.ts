import { groupsAPI } from "~/api/groups-api";
import type { AppStore } from "~/store/store";
import { setGroupCategories } from "~/store/groups/groups-slice";
import { parseBoolean, parseEnum, parseIdsFromCookie } from "~/helpers/cookie-parsers";
import { setGroupFilters, setGroupsOrder, setGroupStatus } from "~/store/general/general-slice";
import { GROUP_FILTERS, GROUP_SORT_KEY, GROUP_SORT_TYPE, GROUP_STATUS } from "~/constants/cookies-keys";

export async function preloadGroups(store: AppStore, cookies: Record<string, string | undefined>) {
  const { data } = await groupsAPI.getGroupsCategories();
  store.dispatch(setGroupCategories(data));

  const filters = parseIdsFromCookie(cookies[GROUP_FILTERS]);
  store.dispatch(setGroupFilters(filters));

  const status = parseEnum(cookies[GROUP_STATUS], ["Всі", "Активний", "Архів"], "Всі");
  store.dispatch(setGroupStatus(status));

  const sortKey = cookies[GROUP_SORT_KEY];
  const sortDesc = parseBoolean(cookies[GROUP_SORT_TYPE]);

  if (sortKey) {
    store.dispatch(setGroupsOrder({ id: sortKey, desc: sortDesc }));
  }
}
