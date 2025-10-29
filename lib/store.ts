import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Todo } from "./schemas";

interface AuthState {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 hasHydrated: boolean;
 login: (user: User, token: string) => void;
 logout: () => void;
 setUser: (user: User) => void;
 setHasHydrated: (state: boolean) => void;
}

interface TodoState {
 todos: Todo[];
 selectedTodos: string[];
 setTodos: (todos: Todo[]) => void;
 addTodo: (todo: Todo) => void;
 updateTodo: (id: string, updates: Partial<Todo>) => void;
 deleteTodo: (id: string) => void;
 toggleTodoSelection: (id: string) => void;
 clearSelectedTodos: () => void;
 deleteSelectedTodos: () => void;
}

export const useAuthStore = create<AuthState>()(
 persist(
  (set, get) => ({
   user: null,
   token: null,
   isAuthenticated: false,
   hasHydrated: false,
   login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true });
   },
   logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
   },
   setUser: (user) => set({ user }),
   setHasHydrated: (state) => set({ hasHydrated: state }),
  }),
  {
   name: "auth-storage",
   partialize: (state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
   }),
   onRehydrateStorage: () => (state) => {
    if (state) {
     if (state.token && state.user) {
      state.isAuthenticated = true;

      localStorage.setItem("token", state.token);
     } else {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
     }

     state.hasHydrated = true;
    }
   },
  }
 )
);

export const useTodoStore = create<TodoState>()((set, get) => ({
 todos: [],
 selectedTodos: [],
 setTodos: (todos) => set({ todos }),
 addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
 updateTodo: (id, updates) =>
  set((state) => ({
   todos: state.todos.map((todo) =>
    todo.id === id ? { ...todo, ...updates } : todo
   ),
  })),
 deleteTodo: (id) =>
  set((state) => ({
   todos: state.todos.filter((todo) => todo.id !== id),
   selectedTodos: state.selectedTodos.filter((selectedId) => selectedId !== id),
  })),
 toggleTodoSelection: (id) =>
  set((state) => {
   const isSelected = state.selectedTodos.includes(id);
   return {
    selectedTodos: isSelected
     ? state.selectedTodos.filter((selectedId) => selectedId !== id)
     : [...state.selectedTodos, id],
   };
  }),
 clearSelectedTodos: () => set({ selectedTodos: [] }),
 deleteSelectedTodos: () =>
  set((state) => ({
   todos: state.todos.filter((todo) => !state.selectedTodos.includes(todo.id)),
   selectedTodos: [],
  })),
}));
