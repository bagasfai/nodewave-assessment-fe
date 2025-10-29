import React from "react";
import { AuthGuard } from "../components/AuthGuard";
import { UserGuard } from "../components/UserGuard";
import { Navigation } from "../components/Navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
 return (
  <AuthGuard requireAuth={true}>
   <UserGuard>
    <Navigation />
    {children}
   </UserGuard>
  </AuthGuard>
 );
};

export default Layout;
