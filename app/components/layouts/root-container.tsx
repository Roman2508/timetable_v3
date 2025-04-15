import React from "react";

const RootContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-[20px]">{children}</div>
  );
};

export { RootContainer };
