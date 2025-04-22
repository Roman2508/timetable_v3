import React from "react";

const RootContainer: React.FC<React.PropsWithChildren<{ classNames?: string }>> = ({ children, classNames = "" }) => {
  return <div className={`w-full max-w-[1600px] mx-auto px-[20px] ${classNames}`}>{children}</div>;
};

// max-w-[1440px]

export { RootContainer };
