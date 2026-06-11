import React from "react";

export const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <title>{title}</title>
      {children}
    </>
  );
};
