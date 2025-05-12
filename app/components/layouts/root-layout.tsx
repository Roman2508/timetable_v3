import React from "react";
import { Outlet, useLocation } from "react-router";

import Footer from "../features/footer/footer";
import { TooltipProvider } from "../ui/common/tooltip";
import { Header } from "~/components/features/header/header";
import { LoadingBar } from "../features/loading-bar/loading-bar";
import { AppSidebar } from "~/components/features/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/common/sidebar";

const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  const disableFooterPaths = ["/grade-book", "/timetable"];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
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
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default RootLayout;
