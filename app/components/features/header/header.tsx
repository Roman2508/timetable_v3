import { Fullscreen } from "lucide-react";

import { Button } from "~/components/ui/common/button";
import { Separator } from "~/components/ui/common/separator";
import { SidebarTrigger } from "~/components/ui/common/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/common/avatar";

export const Header = () => {
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "./avatars/shadcn.jpg",
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <Button
          variant="ghost"
          className="-ml-1"
          size="icon"
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.body.requestFullscreen();
          }}
        >
          <Fullscreen />
        </Button>

        {/* <h1 className="text-base font-medium">Кадровий склад</h1> */}

        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}

          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-right text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>

            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
