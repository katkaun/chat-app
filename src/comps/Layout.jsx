import React from "react";

const Layout = ({ children, theme = "cupcake" }) => {
  return (
    <div className={`relative min-h-screen`} data-theme={theme}>
      {children}
    </div>
  );
};

export default Layout;