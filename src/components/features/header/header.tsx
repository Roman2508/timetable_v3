import { SidebarTrigger } from "@/components/ui/common/sidebar";
import React from "react";

const Header = () => {
  return (
    <header className="p-4 flex items-center justify-between border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="text-lg font-bold">Header</h2>
      </div>

      <div>User</div>
    </header>
  );
};

export default Header;
