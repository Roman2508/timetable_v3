import { Fullscreen } from "lucide-react";

import UserDropdown from "./user-dropdown";
import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { SidebarTrigger } from "~/components/ui/common/sidebar";

export const Header = () => {
  const user = {
    name: "Пташник Роман",
    email: "ptashnyk.roman@pharm.zt.ua",
    avatar: "./avatars/shadcn.jpg",
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 !h-10 !w-10" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <Button
          variant="ghost"
          className="-ml-1 !h-10 !w-10"
          size="icon"
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.body.requestFullscreen();
          }}
        >
          <Fullscreen />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
};
