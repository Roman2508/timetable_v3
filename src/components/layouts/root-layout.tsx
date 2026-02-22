import { type FC } from "react"
import { CookiesProvider } from "react-cookie"
import { Outlet, useLocation } from "react-router"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { cn } from "@/lib/utils"
import AuthLayout from "./auth-layout"
import SidebarLayout from "./sidebar-layout"
import { Toaster } from "../ui/common/sonner"
import Footer from "../features/footer/footer"
import { persistor, store } from "@/store/store"
import { TooltipProvider } from "../ui/common/tooltip"
import { Header } from "@/components/features/header/header"
import { LoadingBar } from "../features/loading-bar/loading-bar"

const disableFooterPaths = ["/grade-book", "/timetable"]
const disablePaddingPaths = ["/grade-book", "/streams"]

const RootLayout: FC = () => {
  const { pathname } = useLocation()

  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TooltipProvider>
            <Toaster />
            {pathname !== "/auth" ? (
              <AuthLayout>
                <SidebarLayout>
                  <LoadingBar />

                  <Header />

                  <main className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                      <div
                        className={cn(
                          "flex flex-col gap-4 flex-1",
                          !disablePaddingPaths.includes(pathname) && "py-4 md:gap-6 md:py-6",
                        )}
                      >
                        <Outlet />
                      </div>
                    </div>
                  </main>

                  {!disableFooterPaths.includes(pathname) && <Footer />}
                </SidebarLayout>
              </AuthLayout>
            ) : (
              <Outlet />
            )}
          </TooltipProvider>
        </PersistGate>
      </ReduxProvider>
    </CookiesProvider>
  )
}

export default RootLayout
