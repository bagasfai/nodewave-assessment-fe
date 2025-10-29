"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store";
import { useVerifyToken } from "../../lib/hooks";

interface AuthGuardProps {
 children: React.ReactNode;
 requireAuth?: boolean;
 redirectTo?: string;
}

export function AuthGuard({
 children,
 requireAuth = true,
 redirectTo = "/login",
}: AuthGuardProps) {
 const router = useRouter();
 const { isAuthenticated, token, user, hasHydrated } = useAuthStore();

 const { isLoading, error } = useVerifyToken();

 useEffect(() => {
  if (!hasHydrated) return;

  // If auth is required and user not logged in (no token/user)
  if (requireAuth && !isLoading && (!isAuthenticated || !token)) {
   router.push(redirectTo);
  }
 }, [
  requireAuth,
  isAuthenticated,
  token,
  isLoading,
  hasHydrated,
  router,
  redirectTo,
 ]);

 // Show loading while verifying token on initial load
 if ((requireAuth && isLoading) || !hasHydrated) {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
     <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
     <p className="text-gray-600 dark:text-gray-400">
      Verifying authentication...
     </p>
    </div>
   </div>
  );
 }

 // If we require auth but have no token and are not authenticated, don't render
 if (requireAuth && !token && !isAuthenticated) {
  return null;
 }

 return <>{children}</>;
}
