"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import PasswordInput from "../../components/PasswordInput";
import { useLogin } from "../../../lib/hooks";
import { loginSchema, LoginData } from "../../../lib/schemas";
import { clsx } from "clsx";

const Login = () => {
 const router = useRouter();
 const loginMutation = useLogin();

 const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
  setValue,
 } = useForm<LoginData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
   email: "",
   password: "",
  },
 });

 const watchedValues = watch();

 const onSubmit = async (data: LoginData) => {
  try {
   await loginMutation.mutateAsync(data);
   router.push("/dashboard");
  } catch (error) {
   // Error handling is done in the hook
  }
 };

 return (
  <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-gray-50">
   {/* rotated background (behind content) */}
   <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[120%] h-1/2 transform rotate-3 origin-top-right bg-white dark:bg-blue-900" />
   </div>

   {/* Header */}
   <div className="z-10 flex flex-col items-center justify-center gap-4 mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
     Sign In
    </h1>
    <p className="max-w-md text-sm font-light text-center text-gray-500 dark:text-gray-400">
     Just sign in if you have an account in here. Enjoy our Website
    </p>
   </div>

   {/* Form */}
   <form
    onSubmit={handleSubmit(onSubmit)}
    className="z-10 w-full max-w-xl p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl"
   >
    <div className="space-y-6">
     <div className="grid grid-cols-1">
      <FloatingLabelInput
       label="Your Email"
       type="email"
       value={watchedValues.email}
       onChange={(e) => setValue("email", e.target.value)}
       className={clsx("w-full", errors.email && "border-red-500")}
      />
      {errors.email && (
       <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
      )}
     </div>

     <div className="grid grid-cols-1">
      <PasswordInput
       label="Password"
       value={watchedValues.password}
       onChange={(e) => setValue("password", e.target.value)}
       className={clsx("w-full", errors.password && "border-red-500")}
      />
      {errors.password && (
       <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
      )}
     </div>

     <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-2">
       <input type="checkbox" name="remember" id="remember" />
       <label
        htmlFor="remember"
        className="text-sm text-gray-500 dark:text-gray-400"
       >
        Remember me
       </label>
      </div>
      <div>
       <a
        href="#"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
       >
        Forgot Password?
       </a>
      </div>
     </div>

     <div className="grid grid-cols-1 mt-8">
      <button
       type="submit"
       disabled={loginMutation.isPending}
       className={clsx(
        "py-3 px-6 font-medium rounded-lg transition-colors duration-200",
        loginMutation.isPending
         ? "bg-gray-400 cursor-not-allowed text-gray-200"
         : "bg-blue-600 hover:bg-blue-700 text-white"
       )}
      >
       {loginMutation.isPending ? "Signing in..." : "Login"}
      </button>
     </div>
    </div>
   </form>

   {/* Footer */}
   <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
    Don't have an account?{" "}
    <Link
     href="/register"
     className="text-blue-600 dark:text-blue-400 hover:underline"
    >
     Register here
    </Link>
   </div>
  </div>
 );
};

export default Login;
