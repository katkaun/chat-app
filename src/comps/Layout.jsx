import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        {/* Navbar will be inserted here by NavbarAuth */}
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        {/* Any footer content */}
      </footer>
    </div>
  );
};

export default Layout;