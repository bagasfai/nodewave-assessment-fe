"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../../lib/store";
import { useLogout } from "../../lib/hooks";

export function Navigation() {
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
   <div className="w-full pr-0 mx-auto md:pr-18">
    <div className="flex items-center justify-between h-16">
     {/* Left side - Search */}
     <div className="flex items-center flex-1 max-w-md">
      <div className="relative w-full">
       <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <svg
         className="w-5 h-5 text-gray-400"
         fill="currentColor"
         viewBox="0 0 24 24"
         aria-hidden="true"
        >
         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
       </div>
       <input
        type="text"
        placeholder="Search (Ctrl+/)"
        className="block w-full py-2 pl-10 pr-3 ml-2 text-sm leading-5 placeholder-gray-500 bg-white border border-gray-300 border-none rounded-md focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
       />
      </div>
     </div>

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
