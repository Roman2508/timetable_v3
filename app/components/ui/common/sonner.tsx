import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster as SonnerToaster, toast } from "sonner";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { clearAppAlert, selectAppStatus } from "~/store/app-status/app-status-slice";
import { useAppDispatch } from "~/store/store";

const Toaster = ({ ...props }: ToasterProps) => {
  // const dispatch = useAppDispatch();

  // const { message, status } = useSelector(selectAppStatus);

  // useEffect(() => {
  //   if (!message || !status) return;

  //   toast[status](message);
  //   dispatch(clearAppAlert());
  // }, [message, status, dispatch]);

  // return <SonnerToaster expand richColors closeButton position="bottom-right" toastOptions={{ duration: 3000 }} />;

  const { theme = "system" } = useTheme();
  return (
    <Sonner
      richColors
      closeButton
      position="bottom-right"
      className="toaster group"
      toastOptions={{ duration: 3000 }}
      theme={theme as ToasterProps["theme"]}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
