import { Bell, LogOut, Sparkles, BadgeCheck, CreditCard, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/common/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/common/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/common/avatar";

interface IUserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const UserDropdown: React.FC<IUserDropdownProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="default"
          className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !py-1 !h-10"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} className="" />
            <AvatarFallback className="rounded-lg select-none">ПР</AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold select-none">{user.name}</span>
            <span className="truncate text-xs select-none">{user.email}</span>
          </div>

          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck />
            Профіль
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard />
            Пароль та безпека
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell />
            Персоналізація
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <LogOut />
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
