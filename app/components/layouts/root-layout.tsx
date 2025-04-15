import React from 'react'
import { Outlet } from 'react-router'

import { Header } from '~/components/features/header/header'
import { AppSidebar } from '~/components/features/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/common/sidebar'

const RootLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default RootLayout
