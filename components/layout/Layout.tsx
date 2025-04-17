import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex-grow">{children}</main>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
