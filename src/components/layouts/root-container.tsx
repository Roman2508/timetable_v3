import { type FC, type PropsWithChildren } from "react";

export const RootContainer: FC<PropsWithChildren<{ classNames?: string }>> = ({ children, classNames = "" }) => {
  return <div className={`w-full max-w-[1600px] mx-auto px-[20px] ${classNames}`}>{children}</div>;
};

// max-w-[1440px]
