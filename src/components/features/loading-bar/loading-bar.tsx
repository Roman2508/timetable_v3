import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigation } from "react-router";

export const LoadingBar = () => {
  const navigation = useNavigation();

  NProgress.configure({
    showSpinner: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return null;
};
