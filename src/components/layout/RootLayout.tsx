import React from "react";

import { AppSidebar } from "@/components/features/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/common/sidebar";

interface CustomCSSProperties extends React.CSSProperties {
  "--sidebar-width"?: string;
  "--sidebar-width-icon"?: string;
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    const storedState = localStorage.getItem("sidebar_state");
    if (storedState !== null) {
      setIsOpen(storedState === "expanded");
    }
    console.log(storedState);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "2rem",
        } as CustomCSSProperties
      }
    >
      <AppSidebar />
      {/* <SidebarInset> */}
      {/* <main className={isOpen ? "ml-32" : "ml-0"}> */}
      <main className="relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">
        <div className="pl-[200px]">
          <SidebarTrigger />
          {children}
        </div>
      </main>
      {/* </SidebarInset> */}
    </SidebarProvider>
  );
};

export default RootLayout;
