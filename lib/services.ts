import api from "./api";
import {
 LoginData,
 RegisterData,
 AuthResponse,
 Todo,
 CreateTodoData,
 UpdateTodoData,
 TodoFilters,
 authResponseSchema,
 todosResponseSchema,
 todoResponseSchema,
} from "./schemas";

// Auth Services
export const authService = {
 login: async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/login", data);
  return authResponseSchema.parse(response.data);
 },

 register: async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post("/register", {
   fullName: data.fullName,
   email: data.email,
   password: data.password,
  });
  return authResponseSchema.parse(response.data);
 },

 verifyToken: async (): Promise<AuthResponse> => {
  const response = await api.get("/verify");
  return authResponseSchema.parse(response.data);
 },

 logout: async (): Promise<void> => {
  await api.post("/logout");
 },
};

// Todo Services
export const todoService = {
 getTodos: async (
  filters?: TodoFilters
 ): Promise<{
  todos: Todo[];
  totalData: number;
  totalPage: number;
 }> => {
  const params = new URLSearchParams();

  // Build filters object
  const filterObj: any = {};

  if (filters?.status && filters.status !== "all") {
   filterObj.isDone = filters.status === "done";
  }

  // Add filters if any exist
  if (Object.keys(filterObj).length > 0) {
   params.append("filters", JSON.stringify(filterObj));
  }

  // Add search filters if provided
  if (filters?.search) {
   params.append(
    "searchFilters",
    JSON.stringify({
     item: filters.search,
    })
   );
  }

  if (filters?.page) {
   params.append("page", filters.page.toString());
  }
  if (filters?.limit) {
   params.append("rows", filters.limit.toString());
  }

  // Add default ordering
  params.append("orderKey", "createdAt");
  params.append("orderRule", "desc");

  const queryString = params.toString();
  const url = queryString ? `/todos?${queryString}` : "/todos";

  const response = await api.get(url);
  const parsedResponse = todosResponseSchema.parse(response.data);
  return {
   todos: parsedResponse.content.entries,
   totalData: parsedResponse.content.totalData,
   totalPage: parsedResponse.content.totalPage,
  };
 },

 createTodo: async (data: CreateTodoData): Promise<Todo> => {
  const response = await api.post("/todos", data);
  const parsedResponse = todoResponseSchema.parse(response.data);
  return parsedResponse.content;
 },

 updateTodo: async (id: string, data: UpdateTodoData): Promise<Todo> => {
  const response = await api.put(`/todos/${id}`, data);
  const parsedResponse = todoResponseSchema.parse(response.data);
  return parsedResponse.content;
 },

 markTodo: async (id: string, isDone: boolean): Promise<Todo> => {
  const response = await api.put(`/todos/${id}/mark`, {
   action: isDone ? "DONE" : "UNDONE",
  });
  const parsedResponse = todoResponseSchema.parse(response.data);
  return parsedResponse.content;
 },

 deleteTodo: async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
 },

 deleteMultipleTodos: async (ids: string[]): Promise<void> => {
  await Promise.all(ids.map((id) => api.delete(`/todos/${id}`)));
 },
};

// Admin Services
export const adminService = {
 getAllTodos: async (
  filters?: TodoFilters
 ): Promise<{
  todos: Todo[];
  totalData: number;
  totalPage: number;
 }> => {
  const params = new URLSearchParams();

  // Build filters object
  const filterObj: any = {};

  if (filters?.status && filters.status !== "all") {
   filterObj.isDone = filters.status === "done";
  }

  if (filters?.userId) {
   filterObj.userId = filters.userId;
  }

  // Add filters if any exist
  if (Object.keys(filterObj).length > 0) {
   params.append("filters", JSON.stringify(filterObj));
  }

  // Add search filters if provided
  if (filters?.search) {
   params.append(
    "searchFilters",
    JSON.stringify({
     item: filters.search,
    })
   );
  }

  if (filters?.page) {
   params.append("page", filters.page.toString());
  }
  if (filters?.limit) {
   params.append("rows", filters.limit.toString());
  }

  // Add default ordering
  params.append("orderKey", "createdAt");
  params.append("orderRule", "desc");

  const queryString = params.toString();
  const url = queryString ? `/todos?${queryString}` : "/todos";

  const response = await api.get(url);
  const parsedResponse = todosResponseSchema.parse(response.data);
  return {
   todos: parsedResponse.content.entries,
   totalData: parsedResponse.content.totalData,
   totalPage: parsedResponse.content.totalPage,
  };
 },
};
