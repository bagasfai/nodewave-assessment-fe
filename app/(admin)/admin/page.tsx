"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../../lib/services";
import { TodoFilters } from "../../../lib/schemas";
import { toast } from "sonner";

export default function AdminDashboard() {
 const [filters, setFilters] = useState<TodoFilters>({
  status: "all",
  search: "",
  page: 1,
  limit: 10,
 });
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

 const {
  data: adminData,
  isLoading,
  error,
 } = useQuery({
  queryKey: ["admin-todos", filters],
  queryFn: () => adminService.getAllTodos(filters),
  retry: false,
 });

 const handleFilterChange = (newFilters: Partial<TodoFilters>) => {
  setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
 };

 const handlePageChange = (page: number) => {
  setFilters((prev) => ({ ...prev, page }));
 };

 const clearFilters = () => {
  setFilters({
   status: "all",
   search: "",
   userId: "",
   page: 1,
   limit: 10,
  });
 };

 if (error) {
  toast.error("Failed to load admin data");
 }

 return (
  <div className="flex min-h-screen bg-gray-50">
   {/* Sidebar */}
   <div
    className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
     sidebarCollapsed ? "w-16" : "w-64"
    }`}
   >
    <div className={sidebarCollapsed ? "px-0 py-4" : "p-6"}>
     <div
      className={`flex items-center mb-6 ${
       sidebarCollapsed ? "justify-center mt-3" : "justify-between"
      }`}
     >
      <h2
       className={`text-lg font-semibold text-gray-800 transition-opacity duration-300 ${
        sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
       }`}
      >
       Nodewave
      </h2>
      <button
       onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
       className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
       <svg
        className={`w-5 h-5 transition-transform duration-300 ${
         sidebarCollapsed ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth="2"
         d="M15 19l-7-7 7-7"
        />
       </svg>
      </button>
     </div>
     <nav className={`space-y-2 ${sidebarCollapsed ? "p-2" : ""}`}>
      <a
       href="#"
       className={`flex items-center px-4 py-3 font-medium text-blue-600 rounded-lg bg-blue-50 transition-all duration-300 ${
        sidebarCollapsed ? "justify-center" : ""
       }`}
       title={sidebarCollapsed ? "To Do" : ""}
      >
       <svg
        className="w-5 h-5 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
       >
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
       </svg>
       <span
        className={`ml-3 transition-opacity duration-300 ${
         sidebarCollapsed ? "hidden" : "opacity-100"
        }`}
       >
        To Do
       </span>
      </a>
     </nav>
    </div>
   </div>

   {/* Main Content */}
   <div
    className={`flex-1 mt-4 transition-all duration-300 ease-in-out ${
     sidebarCollapsed ? "ml-16" : "ml-64"
    }`}
   >
    <div className="p-6">
     {/* Header */}
     <div className="mb-8 ml-8">
      <h1 className="text-3xl font-bold text-gray-900">To Do</h1>
     </div>

     {/* Search and Filter Section */}
     <div className="p-8 mb-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-8 mb-8">
       <div className="flex items-center gap-4">
        <div className="relative max-w-md border-b">
         <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          placeholder="Search"
          className="w-full px-4 py-2 pl-10 border-none rounded-lg focus:outline-none"
         />
         <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth="2"
           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
         </svg>
        </div>
        <button className="px-6 py-1 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
         Search
        </button>
       </div>
       <div className="flex items-center gap-4 border-b ml-14">
        <select
         value={filters.status || "all"}
         onChange={(e) =>
          handleFilterChange({
           status: e.target.value as "all" | "done" | "undone",
          })
         }
         className="px-4 py-2 border-none rounded-lg focus:outline-none"
        >
         <option value="all">Filter by Status</option>
         <option value="done">Success</option>
         <option value="undone">Pending</option>
        </select>
       </div>
      </div>

      {/* Loading State */}
      {isLoading && (
       <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
       </div>
      )}

      {/* Table */}
      {adminData && (
       <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <table className="min-w-full">
         <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
           <th className="px-6 py-4 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
            User ID
           </th>
           <th className="px-6 py-4 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
            To do
           </th>
           <th className="px-6 py-4 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
            Status
           </th>
          </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
          {adminData.todos.map((todo) => (
           <tr key={todo.id} className="transition-colors hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-sm font-medium text-gray-900">
              {todo.userId}
             </div>
            </td>
            <td className="px-6 py-4">
             <div className="text-sm text-gray-900">{todo.item}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
             <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
               todo.isDone
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
             >
              {todo.isDone ? "Success" : "Pending"}
             </span>
            </td>
           </tr>
          ))}
         </tbody>
        </table>

        {/* Pagination */}
        {adminData.totalPage > 1 && (
         <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
           <nav className="flex items-center space-x-2">
            <button
             onClick={() => handlePageChange((filters.page || 1) - 1)}
             disabled={(filters.page || 1) <= 1}
             className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
             &lt;
            </button>

            {Array.from(
             { length: Math.min(adminData.totalPage, 5) },
             (_, i) => {
              const page = i + 1;
              return (
               <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                 page === (filters.page || 1)
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
                }`}
               >
                {page}
               </button>
              );
             }
            )}

            <button
             onClick={() => handlePageChange((filters.page || 1) + 1)}
             disabled={(filters.page || 1) >= adminData.totalPage}
             className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
             &gt;
            </button>
           </nav>
          </div>
         </div>
        )}
       </div>
      )}

      {/* No Results */}
      {adminData && adminData.todos.length === 0 && (
       <div className="p-12 bg-white rounded-lg shadow-sm">
        <div className="text-center">
         <p className="text-gray-500">No todos found</p>
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
