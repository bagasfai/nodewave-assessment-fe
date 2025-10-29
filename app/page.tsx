"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";

export default function HomePage() {
 const router = useRouter();
 const { isAuthenticated, hasHydrated, user } = useAuthStore();

 useEffect(() => {
  // Wait for the store to hydrate before making routing decisions
  if (!hasHydrated) {
   return;
  }

  if (isAuthenticated && user) {
   // Check if user is admin and redirect accordingly
   if (user.role === "ADMIN") {
    router.replace("/admin");
   } else {
    router.replace("/dashboard");
   }
  } else {
   // Not authenticated, redirect to login
   router.replace("/login");
  }
 }, [isAuthenticated, hasHydrated, user, router]);

 // Show loading state while determining authentication status
 if (!hasHydrated) {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="text-center">
     <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
     <p className="text-gray-600">Loading...</p>
    </div>
   </div>
  );
 }

 // Show loading state while redirecting
 return (
  <div className="flex items-center justify-center min-h-screen bg-gray-200">
   <div className="text-center">
    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    <p className="text-gray-600">Redirecting...</p>
   </div>
  </div>
 );
}
