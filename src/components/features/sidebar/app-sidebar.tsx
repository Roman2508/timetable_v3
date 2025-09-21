"use client"

import { useSelector } from "react-redux"
import { useState, useMemo, type ComponentProps } from "react"

import { navData } from "./nav-data"
import { generalSelector } from "@/store/general/general-slice"
import { NavMain } from "@/components/features/sidebar/nav-main"
import { NavUser } from "@/components/features/sidebar/nav-user"
import { TeamSwitcher } from "@/components/features/sidebar/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/common/sidebar"
import UserDropdown from "../header/user-dropdown"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const [navigation, setNavigation] = useState(navData)

  const { sidebar } = useSelector(generalSelector)

  useMemo(() => {
    setNavigation((prev) => {
      const navMain = prev.navMain.map((el) => {
        const isExpanded = sidebar.expandedItems.some((item) => item === el.key)
        if (isExpanded) {
          return { ...el, isActive: true }
        }
        return el
      })

      return { ...prev, navMain }
    })
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigation.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
