import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/common/sidebar"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/store"
import { changeExpandSidebarItems, generalSelector } from "@/store/general/general-slice"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/common/collapsible"

interface INavMainItem {
  id: string
  key: string
  title: string
  icon: LucideIcon
  items?: { id: string; title: string; url: string; icon: LucideIcon }[]
}

interface INavMain {
  items: INavMainItem[]
}

const NavMain: React.FC<INavMain> = ({ items }) => {
  const { pathname } = useLocation()

  const dispatch = useAppDispatch()

  const { sidebar } = useSelector(generalSelector)

  const onChangeExpanded = (item: string) => {
    dispatch(changeExpandSidebarItems(item))
  }

  console.log(sidebar.expandedItems)

  const checkIsExpanded = (id: string) => {
    return sidebar.expandedItems.some((el) => el === id)
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            asChild
            key={item.title}
            className="group/collapsible"
            defaultOpen={checkIsExpanded(item.id)}
            onClick={() => onChangeExpanded(item.id)}
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
  )
}

export { NavMain }
