"use client";

import React from "react";
import { useSelector } from "react-redux";

import { navData } from "./nav-data";
import { generalSelector } from "~/store/general/general-slice";
import { NavMain } from "~/components/features/sidebar/nav-main";
import { NavUser } from "~/components/features/sidebar/nav-user";
import { TeamSwitcher } from "~/components/features/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "~/components/ui/common/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navifation, setNavigation] = React.useState(navData);

  const { sidebar } = useSelector(generalSelector);

  React.useMemo(() => {
    setNavigation((prev) => {
      const navMain = prev.navMain.map((el) => {
        const isExpanded = sidebar.expandedItems.some((item) => item === el.key);
        if (isExpanded) {
          return { ...el, isActive: true };
        }
        return el;
      });

      return { ...prev, navMain };
    });
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navifation.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navifation.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navifation.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
