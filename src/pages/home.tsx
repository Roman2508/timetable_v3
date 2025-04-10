import React from "react";

import { useSidebar } from "@/components/ui/common/sidebar";

const Home = () => {
  const isFirstRender = React.useRef(true);

  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  React.useEffect(() => {
    const storedState = localStorage.getItem("sidebar_state");
    if (storedState !== null) {
      setOpen(storedState === "expanded");
    }
  }, []);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.localStorage.setItem("sidebar_state", state);
  }, [state]);

  return <div>home</div>;
};

export default Home;
