import React, { useMemo, type FC, type PropsWithChildren } from "react";
import cookie from "cookie";
import { Provider as ReduxProvider } from "react-redux";
import { Outlet, redirect, useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";

import {
  PLAN_STATUS,
  GROUP_STATUS,
  PLAN_FILTERS,
  GROUP_FILTERS,
  PLAN_EXPANDED,
  TIMETABLE_WEEK,
  TIMETABLE_ITEM,
  TIMETABLE_TYPE,
  GROUP_SORT_KEY,
  TEACHER_STATUS,
  GROUP_SORT_TYPE,
  AUDITORY_STATUS,
  STREAMS_FILTERS,
  TEACHER_FILTERS,
  TEACHER_SORT_KEY,
  AUDITORY_FILTERS,
  AUDITORY_SORT_KEY,
  TEACHER_SORT_TYPE,
  AUDITORY_SORT_TYPE,
  TIMETABLE_SEMESTER,
  TIMETABLE_CATEGORY,
  SIDEBAR_COOKIE_NAME,
  EXPANDED_SIDEBAR_ITEMS,
} from "~/constants/cookies-keys";
import {
  setPlanStatus,
  setGroupsOrder,
  setGroupStatus,
  setPlanFilters,
  setSidebarState,
  setGroupFilters,
  setTeacherOrder,
  setPlanExpanded,
  setAuditoryOrder,
  setTeacherStatus,
  setStreamFilters,
  setTimetableData,
  setAuditoryStatus,
  setTeacherFilters,
  setAuditoryFilters,
  toggleExpandedSidebarItems,
} from "~/store/general/general-slice";
import { plansAPI } from "~/api/plans-api";
import { groupsAPI } from "~/api/groups-api";
import SidebarLayout from "./sidebar-layout";
import { Toaster } from "../ui/common/sonner";
import Footer from "../features/footer/footer";
import { CookiesProvider } from "react-cookie";
import AlertModal from "../features/alert-modal";
import { teachersAPI } from "~/api/teachers-api";
import { settingsAPI } from "~/api/settings-api";
import ConfirmModal from "../features/confirm-modal";
import { auditoriesAPI } from "~/api/auditories-api";
import { TooltipProvider } from "../ui/common/tooltip";
import { makeStore, type RootState } from "~/store/store";
import { Header } from "~/components/features/header/header";
import { setSettings } from "~/store/settings/settings-slice";
import { setPlanCategories } from "~/store/plans/plans-slice";
import { LoadingBar } from "../features/loading-bar/loading-bar";
import { setGroupCategories } from "~/store/groups/groups-slice";
import { setTeacherCategories } from "~/store/teachers/teachers-slice";
import { setAuditoryCategories } from "~/store/auditories/auditories-slise";
import type { Route } from "./+types/root-layout";
import { userContext } from "~/context";
import {
  preloadAuditories,
  preloadGeteral,
  preloadGroups,
  preloadPlans,
  preloadStreams,
  preloadTeachers,
  preloadTimetable,
} from "~/loaders";
import { authMe } from "~/store/auth/auth-async-actions";

export async function loader({ request }: LoaderFunctionArgs) {
  const store = makeStore();

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  if (!cookies.token) {
    return redirect("/auth");
  }

  // const user = await store.dispatch(authMe(token))

  await Promise.all([
    preloadGeteral(store, cookies),
    preloadGroups(store, cookies),
    preloadPlans(store, cookies),
    preloadTeachers(store, cookies),
    preloadAuditories(store, cookies),
    preloadStreams(store, cookies),
    preloadTimetable(store, cookies),
  ]);

  // settings
  const { data: settings } = await settingsAPI.getSettings();
  store.dispatch(setSettings(settings));

  return {
    preloadedState: store.getState(),
  };
}

const StoreLayout: FC = () => {
  const { preloadedState } = useLoaderData() as { preloadedState: RootState };
  const store = useMemo(() => makeStore(preloadedState), [preloadedState]);

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ReduxProvider store={store}>
        <Outlet />
      </ReduxProvider>
    </CookiesProvider>
  );
};

export default StoreLayout;
