import type { AppStore } from "~/store/store";
import { EXPANDED_SIDEBAR_ITEMS, SIDEBAR_COOKIE_NAME } from "~/constants/cookies-keys";
import { setSidebarState, toggleExpandedSidebarItems } from "~/store/general/general-slice";

export async function preloadGeteral(store: AppStore, cookies: Record<string, string | undefined>) {
  const isSidebarOpen = cookies[SIDEBAR_COOKIE_NAME] === "true";
  store.dispatch(setSidebarState(isSidebarOpen));

  const expandedItems = (cookies[EXPANDED_SIDEBAR_ITEMS] ?? "").split(",");
  store.dispatch(toggleExpandedSidebarItems(expandedItems));
}
