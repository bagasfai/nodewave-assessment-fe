"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../../lib/store";
import { useLogout } from "../../lib/hooks";

export function AdminNavigation() {
 const router = useRouter();
 const { user } = useAuthStore();
 const logout = useLogout();
 const [isProfileOpen, setIsProfileOpen] = useState(false);

 const handleLogout = () => {
  logout.mutate();
  router.push("/login");
 };

 return (
  <nav className="bg-white border-b border-gray-200 shadow-sm">
   <div className="w-full mx-auto pr-18">
    <div className="flex items-center justify-end h-16">
     {/* Right side - User Profile */}
     <div className="flex items-center">
      <div className="relative">
       <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        onMouseEnter={() => setIsProfileOpen(true)}
        className="flex items-center p-2 space-x-3 text-sm transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50"
       >
        <span className="font-medium text-gray-700">{user?.fullName}</span>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
         <span className="text-sm font-medium text-white">
          {user?.fullName?.charAt(0).toUpperCase()}
         </span>
        </div>
       </button>

       {/* Dropdown Menu */}
       {isProfileOpen && (
        <div
         className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
         onMouseLeave={() => setIsProfileOpen(false)}
        >
         <div className="py-1">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
           <div className="font-medium">{user?.fullName}</div>
           <div className="text-gray-500">{user?.email}</div>
          </div>
          <button
           onClick={handleLogout}
           disabled={logout.isPending}
           className="block w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
           {logout.isPending ? "Logging out..." : "Logout"}
          </button>
         </div>
        </div>
       )}
      </div>
     </div>
    </div>
   </div>
  </nav>
 );
}
