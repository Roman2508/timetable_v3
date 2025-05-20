import React from "react";
import cookie from "cookie";
import { Provider } from "react-redux";
import { Outlet, useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";

import SidebarLayout from "./sidebar-layout";
import Footer from "../features/footer/footer";
import { CookiesProvider } from "react-cookie";
import AlertModal from "../features/alert-modal";
import ConfirmModal from "../features/confirm-modal";
import { TooltipProvider } from "../ui/common/tooltip";
import { makeStore, type RootState } from "~/store/store";
import { Header } from "~/components/features/header/header";
import { LoadingBar } from "../features/loading-bar/loading-bar";
import { EXPANDED_SIDEBAR_ITEMS, GROUP_FILTERS, GROUP_STATUS, SIDEBAR_COOKIE_NAME } from "~/constants/cookies-keys";
import {
  setGroupFilters,
  setGroupStatus,
  setSidebarState,
  toggleExpandedSidebarItems,
} from "~/store/general/general-slice";

export async function loader({ request }: LoaderFunctionArgs) {
  const store = makeStore();

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  const isSidebarOpen = cookies[SIDEBAR_COOKIE_NAME] === "true";
  store.dispatch(setSidebarState(isSidebarOpen));

  const expandedSidebarItems = (cookies[EXPANDED_SIDEBAR_ITEMS] ?? "").split(",");
  store.dispatch(toggleExpandedSidebarItems(expandedSidebarItems));

  const groupFilters = JSON.parse(cookies[GROUP_FILTERS] ?? "");
  const categoriesIds = groupFilters.filter((el: string) => Number(el)).map((el: any) => ({ id: Number(el) }));
  store.dispatch(setGroupFilters(categoriesIds));

  const groupStatus = (cookies[GROUP_STATUS] ?? "Всі") as "Всі" | "Активний" | "Архів";
  store.dispatch(setGroupStatus(groupStatus));

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
      <Provider store={store}>
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
      </Provider>
    </CookiesProvider>
  );
};

export default RootLayout;
