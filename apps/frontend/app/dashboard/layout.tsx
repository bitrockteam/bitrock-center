import React from "react";
import { AuthenticatedPage } from "../(auth)/AuthenticatedPage";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <AuthenticatedPage>{children}</AuthenticatedPage>;
};

export default Layout;
