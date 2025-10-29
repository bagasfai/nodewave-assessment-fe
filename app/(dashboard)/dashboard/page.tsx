"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
 useTodos,
 useCreateTodo,
 useMarkTodo,
 useDeleteMultipleTodos,
} from "../../../lib/hooks";
import { useTodoStore, useAuthStore } from "../../../lib/store";

const Dashboard = () => {
 const router = useRouter();
 const [newTodo, setNewTodo] = useState("");
 const [filters, setFilters] = useState({
  page: 1,
  limit: 10,
 });

 // Auth state
 const { user, isAuthenticated } = useAuthStore();

 // Todo state and actions
 const { todos, selectedTodos, toggleTodoSelection } = useTodoStore();

 // API hooks - Pass filters to get paginated data
 const { data: todosData, isLoading, error } = useTodos(filters);
 const createTodoMutation = useCreateTodo();
 const markTodoMutation = useMarkTodo();
 const deleteMultipleMutation = useDeleteMultipleTodos();

 // Redirect if not authenticated
 useEffect(() => {
  if (!isAuthenticated) {
   router.push("/login");
  }
 }, [isAuthenticated, router]);

 const addTodo = async () => {
  if (newTodo.trim()) {
   try {
    await createTodoMutation.mutateAsync({
     item: newTodo.trim(),
    });
    setNewTodo("");
   } catch (error) {
    // Error handling is done in the hook
   }
  }
 };

 const toggleComplete = async (id: string, isDone: boolean) => {
  try {
   await markTodoMutation.mutateAsync({
    id,
    isDone: !isDone,
   });
  } catch (error) {
   // Error handling is done in the hook
  }
 };

 const deleteSelected = async () => {
  if (selectedTodos.length > 0) {
   try {
    await deleteMultipleMutation.mutateAsync(selectedTodos);
   } catch (error) {
    // Error handling is done in the hook
   }
  }
 };

 const handlePageChange = (page: number) => {
  setFilters((prev) => ({ ...prev, page }));
 };

 const hasSelectedItems = selectedTodos.length > 0;

 if (!isAuthenticated) {
  return null; // Will redirect in useEffect
 }

 if (isLoading) {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="text-center">
     <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
     <p className="text-gray-600">Loading todos...</p>
    </div>
   </div>
  );
 }

 if (error) {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="text-center">
     <p className="mb-4 text-red-600">Failed to load todos</p>
     <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
     >
      Retry
     </button>
    </div>
   </div>
  );
 }

 return (
  <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gray-200">
   {/* Angled Background */}
   <div className="absolute inset-0 pointer-events-none">
    <div
     className="absolute w-full bg-white rounded-lg h-[45%]"
     style={{
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
     }}
    />
   </div>

   <div className="z-10 w-full max-w-2xl">
    {/* Header */}
    <div className="mb-8 text-center">
     <h1 className="mb-2 text-4xl font-bold text-blue-800">To Do</h1>
    </div>

    {/* Todo Container */}
    <div className="p-4 overflow-hidden bg-white border-2 shadow-lg rounded-2xl">
     {/* Add Todo Section */}
     <div className="p-6">
      <div className="mb-2 text-sm font-semibold text-gray-500">
       Add a new task
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
       <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) =>
         e.key === "Enter" && !createTodoMutation.isPending && addTodo()
        }
        placeholder="Enter your todo..."
        disabled={createTodoMutation.isPending}
        className="flex-1 px-4 transition-colors border-b-2 border-gray-800 outline-none bg-gray-50 focus:border-blue-500 disabled:opacity-50"
       />
       <button
        onClick={addTodo}
        disabled={createTodoMutation.isPending || !newTodo.trim()}
        className={clsx(
         "px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200",
         createTodoMutation.isPending || !newTodo.trim()
          ? "bg-gray-400 cursor-not-allowed text-gray-200"
          : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
       >
        {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
       </button>
      </div>
     </div>

     {/* Todo List */}
     <div className="p-6">
      {todos.length === 0 ? (
       <div className="py-8 text-center">
        <p className="text-gray-500">No todos yet. Add one above!</p>
       </div>
      ) : (
       <div className="space-y-1">
        {todos.map((todo) => (
         <div
          key={todo.id}
          className="flex items-center justify-between py-3 border-b border-gray-400 last:border-b-0 group"
         >
          <div className="flex items-center flex-1 gap-3">
           <button
            onClick={() => toggleTodoSelection(todo.id)}
            className={clsx(
             "w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 hover:cursor-pointer",
             selectedTodos.includes(todo.id)
              ? "bg-green-100 border-green-100 text-[#6DD230]"
              : "bg-gray-200 border-none hover:border-green-400"
            )}
           >
            {selectedTodos.includes(todo.id) && (
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
               fillRule="evenodd"
               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
               clipRule="evenodd"
              />
             </svg>
            )}
           </button>
           <span
            className={clsx(
             "text-lg transition-all duration-200 text-gray-800"
            )}
           >
            {todo.item}
           </span>
          </div>
          <button
           onClick={() => toggleComplete(todo.id, todo.isDone)}
           disabled={markTodoMutation.isPending}
           className={clsx(
            "w-8 h-8 rounded-full hover:cursor-pointer flex items-center justify-center transition-all duration-200",
            todo.isDone
             ? "border-2 border-green-500 text-green-600"
             : "border-2 border-red-500 text-red-600",
            markTodoMutation.isPending && "opacity-50 cursor-not-allowed"
           )}
          >
           {todo.isDone ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
             <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
             />
            </svg>
           ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
             <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
             />
            </svg>
           )}
          </button>
         </div>
        ))}
       </div>
      )}

      {/* Delete Selected Button */}
      {hasSelectedItems && (
       <div className="mt-6 text-center md:text-start">
        <button
         onClick={deleteSelected}
         disabled={deleteMultipleMutation.isPending}
         className={clsx(
          "px-6 py-1 font-medium rounded-sm transition-colors w-full md:w-46 duration-200",
          deleteMultipleMutation.isPending
           ? "bg-gray-400 cursor-not-allowed text-gray-200"
           : "bg-red-400 hover:bg-red-600 text-white"
         )}
        >
         {deleteMultipleMutation.isPending ? "Deleting..." : `Deleted Selected`}
        </button>
       </div>
      )}

      {/* Pagination */}
      {todosData && todosData.totalPage > 1 && (
       <div className="mt-6 flex justify-center">
        <nav className="flex items-center space-x-2">
         <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page <= 1}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
         >
          &lt;
         </button>

         {Array.from({ length: Math.min(todosData.totalPage, 5) }, (_, i) => {
          const page = i + 1;
          return (
           <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
             page === filters.page
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:text-gray-700"
            }`}
           >
            {page}
           </button>
          );
         })}

         <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page >= todosData.totalPage}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
         >
          &gt;
         </button>
        </nav>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
};

export default Dashboard;
