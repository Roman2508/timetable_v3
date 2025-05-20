"use client";

import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "~/components/ui/common/sidebar";
import { cn } from "~/lib/utils";
import { useAppDispatch } from "~/store/store";
import { EXPANDED_SIDEBAR_ITEMS } from "~/constants/cookies-keys";
import { changeExpandSidebarItems, generalSelector } from "~/store/general/general-slice";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/common/collapsible";

interface INavMainItem {
  title: string;
  key: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface INavMain {
  items: INavMainItem[];
}

const NavMain: React.FC<INavMain> = ({ items }) => {
  const { pathname } = useLocation();

  const [_, setCookie] = useCookies();

  const dispatch = useAppDispatch();

  const { sidebar } = useSelector(generalSelector);

  const getExpanded = (item: string) => {
    const isExpanded = sidebar.expandedItems.some((el) => el === item);
    if (isExpanded) {
      return sidebar.expandedItems.filter((el) => el !== item);
    } else {
      return [...sidebar.expandedItems, item];
    }
  };

  const onChangeExpanded = (item: string) => {
    dispatch(changeExpandSidebarItems(item));
    const expandedItemsStr = getExpanded(item).join(",");
    setCookie(EXPANDED_SIDEBAR_ITEMS, expandedItemsStr);
  };

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
            onClick={() => onChangeExpanded(item.key)}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={cn(subItem.url === pathname ? "!text-primary !bg-primary-light" : "")}
                      >
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export { NavMain };
