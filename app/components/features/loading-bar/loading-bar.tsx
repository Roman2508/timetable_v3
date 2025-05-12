import React from "react";
import { useNavigation } from "react-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const LoadingBar = () => {
  const navigation = useNavigation();

  NProgress.configure({
    showSpinner: true,
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return null;
};
