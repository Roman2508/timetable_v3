import React from "react";
import cookie from "cookie";
import { Provider as ReduxProvider } from "react-redux";
import { Outlet, useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";

import {
  PLAN_STATUS,
  GROUP_STATUS,
  GROUP_FILTERS,
  GROUP_SORT_KEY,
  TEACHER_STATUS,
  GROUP_SORT_TYPE,
  AUDITORY_STATUS,
  TEACHER_FILTERS,
  TEACHER_SORT_KEY,
  AUDITORY_FILTERS,
  AUDITORY_SORT_KEY,
  TEACHER_SORT_TYPE,
  AUDITORY_SORT_TYPE,
  SIDEBAR_COOKIE_NAME,
  EXPANDED_SIDEBAR_ITEMS,
  PLAN_FILTERS,
  PLAN_EXPANDED,
  STREAMS_FILTERS,
} from "~/constants/cookies-keys";
import {
  setPlanStatus,
  setGroupsOrder,
  setGroupStatus,
  setSidebarState,
  setGroupFilters,
  setTeacherOrder,
  setAuditoryOrder,
  setTeacherStatus,
  setAuditoryStatus,
  setTeacherFilters,
  setAuditoryFilters,
  toggleExpandedSidebarItems,
  setPlanFilters,
  setPlanExpanded,
  setStreamFilters,
} from "~/store/general/general-slice";
import { plansAPI } from "~/api/plans-api";
import { groupsAPI } from "~/api/groups-api";
import SidebarLayout from "./sidebar-layout";
import Footer from "../features/footer/footer";
import { CookiesProvider } from "react-cookie";
import AlertModal from "../features/alert-modal";
import { teachersAPI } from "~/api/teachers-api";
import ConfirmModal from "../features/confirm-modal";
import { auditoriesAPI } from "~/api/auditories-api";
import { TooltipProvider } from "../ui/common/tooltip";
import { makeStore, type RootState } from "~/store/store";
import { Header } from "~/components/features/header/header";
import { setPlanCategories } from "~/store/plans/plans-slice";
import { LoadingBar } from "../features/loading-bar/loading-bar";
import { setGroupCategories } from "~/store/groups/groups-slice";
import { setTeacherCategories } from "~/store/teachers/teachers-slice";
import { setAuditoryCategories } from "~/store/auditories/auditories-slise";

export async function loader({ request }: LoaderFunctionArgs) {
  const store = makeStore();

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  // general
  const isSidebarOpen = cookies[SIDEBAR_COOKIE_NAME] === "true";
  store.dispatch(setSidebarState(isSidebarOpen));

  const expandedSidebarItems = (cookies[EXPANDED_SIDEBAR_ITEMS] ?? "").split(",");
  store.dispatch(toggleExpandedSidebarItems(expandedSidebarItems));

  // groups
  const { data: groupsCategories } = await groupsAPI.getGroupsCategories();
  store.dispatch(setGroupCategories(groupsCategories));

  // groups-cookies
  const groupFilters = JSON.parse(cookies[GROUP_FILTERS] ?? "[]");
  const groupCategoriesIds = groupFilters.filter((el: string) => Number(el)).map((el: any) => ({ id: Number(el) }));
  store.dispatch(setGroupFilters(groupCategoriesIds));

  const groupStatus = (cookies[GROUP_STATUS] ?? "Всі") as "Всі" | "Активний" | "Архів";
  store.dispatch(setGroupStatus(groupStatus));

  const groupOrderField = cookies[GROUP_SORT_KEY] ?? "";
  const groupOrderType = cookies[GROUP_SORT_TYPE] === "true";
  if (groupOrderField) {
    store.dispatch(setGroupsOrder({ id: groupOrderField, desc: groupOrderType }));
  }

  // plans
  const { data: planCategories } = await plansAPI.getPlansCategories();
  store.dispatch(setPlanCategories(planCategories));

  // plans-cookies
  const planStatus = (cookies[PLAN_STATUS] ?? "Всі") as "Всі" | "Активний" | "Архів";
  store.dispatch(setPlanStatus(planStatus));

  const planFilters = JSON.parse(cookies[PLAN_FILTERS] ?? "[]");
  const planCategoriesIds = planFilters.filter((el: string) => Number(el)).map((el: any) => ({ id: Number(el) }));
  store.dispatch(setPlanFilters(planCategoriesIds));

  const planExpanded = JSON.parse(cookies[PLAN_EXPANDED] ?? "[]");
  const planExpandedIds = planExpanded.filter((el: string) => Number(el)).map((el: any) => ({ id: Number(el) }));
  store.dispatch(setPlanExpanded(planExpandedIds));

  // auditories
  const { data: auditoryCategories } = await auditoriesAPI.getAuditoryCategories();
  store.dispatch(setAuditoryCategories(auditoryCategories));

  // auditories-cookies
  const auditoryFilters = JSON.parse(cookies[AUDITORY_FILTERS] ?? "[]");
  const auditoryCategoriesIds = auditoryFilters
    .filter((el: string) => Number(el))
    .map((el: any) => ({ id: Number(el) }));
  store.dispatch(setAuditoryFilters(auditoryCategoriesIds));

  const auditoryStatus = (cookies[AUDITORY_STATUS] ?? "Всі") as "Всі" | "Активний" | "Архів";
  store.dispatch(setAuditoryStatus(auditoryStatus));

  const auditoryOrderField = cookies[AUDITORY_SORT_KEY] ?? "";
  const auditoryOrderType = cookies[AUDITORY_SORT_TYPE] === "true";
  if (auditoryOrderField) {
    store.dispatch(setAuditoryOrder({ id: auditoryOrderField, desc: auditoryOrderType }));
  }

  // teachers
  const { data: teacherCategories } = await teachersAPI.getTeachersCategories();
  store.dispatch(setTeacherCategories(teacherCategories));

  // teachers-cookies
  const teacherFilters = JSON.parse(cookies[TEACHER_FILTERS] ?? "[]");
  const teacherCategoriesIds = teacherFilters.filter((el: string) => Number(el)).map((el: any) => ({ id: Number(el) }));
  store.dispatch(setTeacherFilters(teacherCategoriesIds));

  const teacherStatus = (cookies[TEACHER_STATUS] ?? "Всі") as "Всі" | "Активний" | "Архів";
  store.dispatch(setTeacherStatus(teacherStatus));

  const teacherOrderField = cookies[TEACHER_SORT_KEY] ?? "";
  const teacherOrderType = cookies[TEACHER_SORT_TYPE] === "true";
  if (teacherOrderField) {
    store.dispatch(setTeacherOrder({ id: teacherOrderField, desc: teacherOrderType }));
  }

  // streams
  store.dispatch(setStreamFilters(cookies[STREAMS_FILTERS] ?? ""));

  return {
    preloadedState: store.getState(),
  };
}

const RootLayout: React.FC = () => {
  const { pathname } = useLocation();
  const disableFooterPaths = ["/grade-book", "/timetable"];

  const { preloadedState } = useLoaderData() as { preloadedState: RootState };
  const store = React.useMemo(() => makeStore(preloadedState), [preloadedState]);

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ReduxProvider store={store}>
        <TooltipProvider>
          <SidebarLayout>
            <ConfirmModal />
            <AlertModal />

            <LoadingBar />

            <Header />

            <main className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <Outlet />
                </div>
              </div>
            </main>

            {!disableFooterPaths.includes(pathname) && <Footer />}
          </SidebarLayout>
        </TooltipProvider>
      </ReduxProvider>
    </CookiesProvider>
  );
};

export default RootLayout;
