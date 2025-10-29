import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, todoService, adminService } from "./services";
import { useAuthStore, useTodoStore } from "./store";
import { UpdateTodoData, TodoFilters } from "./schemas";
import { useEffect } from "react";

// Auth Hooks
export const useLogin = () => {
 const { login } = useAuthStore();

 return useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
   login(data.content.user, data.content.token);
   toast.success(data.message || "Login successful!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Login failed");
  },
 });
};

export const useRegister = () => {
 const { login } = useAuthStore();

 return useMutation({
  mutationFn: authService.register,
  onSuccess: (data) => {
   login(data.content.user, data.content.token);
   toast.success(data.message || "Registration successful!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Registration failed");
  },
 });
};

export const useVerifyToken = () => {
 const { user, token, login, logout } = useAuthStore();

 const query = useQuery({
  queryKey: ["verifyToken"],
  queryFn: authService.verifyToken,
  enabled: !!token && !user,
  retry: false,
  staleTime: Infinity,
 });

 useEffect(() => {
  if (query.data) {
   login(query.data.content.user, query.data.content.token);
  }
  if (query.error && !user) {
   logout();
  }
 }, [query.data, query.error, login, logout, user]);

 return query;
};

export const useLogout = () => {
 const { logout } = useAuthStore();
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: authService.logout,
  onSuccess: () => {
   logout();
   queryClient.clear();
   toast.success("Logged out successfully");
  },
  onError: () => {
   logout();
   queryClient.clear();
  },
 });
};

// Todo Hooks
export const useTodos = (filters?: TodoFilters) => {
 const { setTodos } = useTodoStore();

 const query = useQuery({
  queryKey: ["todos", filters],
  queryFn: () => todoService.getTodos(filters),
 });

 useEffect(() => {
  if (query.data) {
   setTodos(query.data.todos);
  }
  if (query.error) {
   toast.error(
    (query.error as any).response?.data?.message || "Failed to fetch todos"
   );
  }
 }, [query.data, query.error, setTodos]);

 return query;
};

export const useCreateTodo = () => {
 const queryClient = useQueryClient();
 const { addTodo } = useTodoStore();

 return useMutation({
  mutationFn: todoService.createTodo,
  onSuccess: (data) => {
   addTodo(data);
   queryClient.invalidateQueries({ queryKey: ["todos"] });
   toast.success("Todo created successfully!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Failed to create todo");
  },
 });
};

export const useUpdateTodo = () => {
 const queryClient = useQueryClient();
 const { updateTodo } = useTodoStore();

 return useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateTodoData }) =>
   todoService.updateTodo(id, data),
  onSuccess: (data) => {
   updateTodo(data.id, data);
   queryClient.invalidateQueries({ queryKey: ["todos"] });
   toast.success("Todo updated successfully!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Failed to update todo");
  },
 });
};

export const useMarkTodo = () => {
 const queryClient = useQueryClient();
 const { updateTodo } = useTodoStore();

 return useMutation({
  mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
   todoService.markTodo(id, isDone),
  onSuccess: (data) => {
   updateTodo(data.id, data);
   queryClient.invalidateQueries({ queryKey: ["todos"] });
   toast.success(`Todo marked as ${data.isDone ? "completed" : "incomplete"}!`);
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Failed to mark todo");
  },
 });
};

export const useDeleteTodo = () => {
 const queryClient = useQueryClient();
 const { deleteTodo } = useTodoStore();

 return useMutation({
  mutationFn: todoService.deleteTodo,
  onSuccess: (_, id) => {
   deleteTodo(id);
   queryClient.invalidateQueries({ queryKey: ["todos"] });
   toast.success("Todo deleted successfully!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Failed to delete todo");
  },
 });
};

export const useDeleteMultipleTodos = () => {
 const queryClient = useQueryClient();
 const { deleteSelectedTodos } = useTodoStore();

 return useMutation({
  mutationFn: todoService.deleteMultipleTodos,
  onSuccess: () => {
   deleteSelectedTodos();
   queryClient.invalidateQueries({ queryKey: ["todos"] });
   toast.success("Selected todos deleted successfully!");
  },
  onError: (error: any) => {
   toast.error(error.response?.data?.message || "Failed to delete todos");
  },
 });
};

// Admin Hooks
export const useAdminTodos = (filters?: TodoFilters) => {
 return useQuery({
  queryKey: ["admin-todos", filters],
  queryFn: () => adminService.getAllTodos(filters),
  retry: false,
 });
};
