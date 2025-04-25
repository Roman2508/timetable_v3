import React from "react";

const WideContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="w-full max-w-[1920px] mx-auto px-[20px]">{children}</div>;
};

export { WideContainer };
