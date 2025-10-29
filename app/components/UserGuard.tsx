"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store";

interface UserGuardProps {
 children: React.ReactNode;
 redirectTo?: string;
}

export function UserGuard({ children, redirectTo = "/admin" }: UserGuardProps) {
 const router = useRouter();
 const { isAuthenticated, user, hasHydrated } = useAuthStore();

 useEffect(() => {
  if (!hasHydrated) return;

  // Redirect admin users to admin panel
  if (isAuthenticated && user && user.role === "ADMIN") {
   router.push(redirectTo);
  }
 }, [isAuthenticated, user, hasHydrated, router, redirectTo]);

 // Show loading while hydrating
 if (!hasHydrated) {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
     <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
     <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
   </div>
  );
 }

 // Don't render children if admin user (they should be redirected)
 if (isAuthenticated && user && user.role === "ADMIN") {
  return null;
 }

 return <>{children}</>;
}
