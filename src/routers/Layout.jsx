import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-[80px] min-h-[90vh]">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
