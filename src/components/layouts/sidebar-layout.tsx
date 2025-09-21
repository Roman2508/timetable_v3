import React from "react"
import { useSelector } from "react-redux"

import { useAppDispatch } from "@/store/store"
import { AppSidebar } from "@/components/features/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/common/sidebar"
import { generalSelector, setSidebarState } from "@/store/general/general-slice"

const SidebarLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { sidebar } = useSelector(generalSelector)

  const toggleSidebar = (open: boolean) => {
    dispatch(setSidebarState(open))
  }

  return (
    <SidebarProvider open={sidebar.open} onOpenChange={toggleSidebar}>
      <AppSidebar variant="sidebar" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarLayout
