import type { AppStore } from "~/store/store";
import { STREAMS_FILTERS } from "~/constants/cookies-keys";
import { setStreamFilters } from "~/store/general/general-slice";

export async function preloadStreams(store: AppStore, cookies: Record<string, string | undefined>) {
  const filters = cookies[STREAMS_FILTERS] ?? "";
  store.dispatch(setStreamFilters(filters));
}
