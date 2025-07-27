import cookie from "cookie";
import { useMemo, type FC } from "react";
import { CookiesProvider } from "react-cookie";
import { Provider as ReduxProvider } from "react-redux";
import { Outlet, redirect, useLoaderData, useLocation, type LoaderFunctionArgs } from "react-router";

import {
  preloadPlans,
  preloadGroups,
  preloadGeteral,
  preloadStreams,
  preloadTeachers,
  preloadTimetable,
  preloadAuditories,
} from "~/loaders";
import { instanse } from "~/api/api";
import { makeStore } from "~/store/store";
import SidebarLayout from "./sidebar-layout";
import { Toaster } from "../ui/common/sonner";
import Footer from "../features/footer/footer";
import { settingsAPI } from "~/api/settings-api";
import type { RootState } from "~/store/app-types";
import { TooltipProvider } from "../ui/common/tooltip";
import { getProfile } from "~/store/auth/auth-async-actions";
import { Header } from "~/components/features/header/header";
import { setSettings } from "~/store/settings/settings-slice";
import { LoadingBar } from "../features/loading-bar/loading-bar";

export const shouldRevalidate = () => {
  return false; // Отключаем повторный вызов лоадера при навигации
};

export async function loader({ request }: LoaderFunctionArgs) {
  const store = makeStore();

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookie.parse(cookieHeader);

  if (!cookies.token) {
    if (!request.url.includes("/auth")) {
      return redirect("/auth");
    } else {
      return { preloadedState: store.getState() };
    }
  }

  instanse.interceptors.request.use((config) => {
    const cookie = cookies && cookies.token ? `token=${cookies.token}` : "";
    config.headers.Cookie = cookie;
    return config;
  });

  const { payload: userProfile } = await store.dispatch(getProfile());

  if (!userProfile) {
    return redirect("/auth");
  }

  if (userProfile && request.url.includes("/auth")) {
    return redirect("/");
  }

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

const RootLayout: FC = () => {
  const { pathname } = useLocation();
  const disableFooterPaths = ["/grade-book", "/timetable"];

  const { preloadedState } = useLoaderData() as { preloadedState: RootState };
  const store = useMemo(() => makeStore(preloadedState), [preloadedState]);

  // const store = makeStore();

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ReduxProvider store={store}>
        <TooltipProvider>
          <Toaster />

          {pathname !== "/auth" ? (
            <SidebarLayout>
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
          ) : (
            <Outlet />
          )}
        </TooltipProvider>
      </ReduxProvider>
    </CookiesProvider>
  );
};

export default RootLayout;
