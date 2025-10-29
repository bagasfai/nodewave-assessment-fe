import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
 email: z.email("Invalid email format"),
 password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
 .object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  phoneNumber: z
   .string()
   .min(10, "Phone number must be at least 10 digits")
   .max(20, "Phone number must be at most 20 digits"),
  country: z.string().min(1, "Country is required"),
  aboutYourself: z
   .string()
   .min(10, "Please tell us at least 10 characters about yourself")
   .max(500, "About yourself must be at most 500 characters"),
 })
 .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
 });

// Todo schemas
export const todoSchema = z.object({
 id: z.string(),
 item: z.string(),
 userId: z.string(),
 isDone: z.boolean(),
 createdAt: z.string(),
 updatedAt: z.string(),
});

// Extended todo schema for admin view (includes user info)
export const adminTodoSchema = z.object({
 id: z.string(),
 item: z.string(),
 userId: z.string(),
 isDone: z.boolean(),
 createdAt: z.string(),
 updatedAt: z.string(),
});

export const createTodoSchema = z.object({
 item: z.string().min(1, "Item is required"),
});

export const updateTodoSchema = z.object({
 item: z.string().min(1, "Item is required").optional(),
 isDone: z.boolean().optional(),
});

// Filter schemas
export const todoFiltersSchema = z.object({
 status: z.enum(["all", "done", "undone"]).optional(),
 search: z.string().optional(),
 userId: z.string().optional(),
 page: z.number().min(1).optional(),
 limit: z.number().min(1).max(100).optional(),
});

// Response schemas
export const authResponseSchema = z.object({
 content: z.object({
  token: z.string(),
  user: z.object({
   id: z.string(),
   fullName: z.string(),
   email: z.string(),
   role: z.enum(["USER", "ADMIN"]),
  }),
 }),
 message: z.string(),
 errors: z.array(z.any()),
});

export const todosResponseSchema = z.object({
 content: z.object({
  entries: z.array(todoSchema),
  totalData: z.number(),
  totalPage: z.number(),
 }),
 message: z.string(),
 errors: z.array(z.any()),
});

export const todoResponseSchema = z.object({
 content: todoSchema, // Single todo wrapped in content
 message: z.string(),
 errors: z.array(z.any()),
});

// Types
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type AdminTodo = z.infer<typeof adminTodoSchema>;
export type CreateTodoData = z.infer<typeof createTodoSchema>;
export type UpdateTodoData = z.infer<typeof updateTodoSchema>;
export type TodoFilters = z.infer<typeof todoFiltersSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type User = AuthResponse["content"]["user"];
