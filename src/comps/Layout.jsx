import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-transparent via-indigo-400 to-indigo-900">
      {children}
    </div>
  );
};

export default Layout;
