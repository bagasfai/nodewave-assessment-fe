"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import PasswordInput from "../../components/PasswordInput";
import { useRegister } from "../../../lib/hooks";
import { registerSchema, RegisterData } from "../../../lib/schemas";
import { clsx } from "clsx";
import PhoneInput from "@/app/components/PhoneInput";
import CountrySelect from "@/app/components/CountrySelect";
import Textarea from "@/app/components/Textarea";

type FormValues = RegisterData & {
 firstName?: string;
 lastName?: string;
};

const Register = () => {
 const router = useRouter();
 const registerMutation = useRegister();

 const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
  setValue,
 } = useForm<FormValues>({
  resolver: zodResolver(registerSchema),
  defaultValues: {
   firstName: "",
   lastName: "",
   fullName: "",
   email: "",
   password: "",
   confirmPassword: "",
   phoneNumber: "",
   country: "",
   aboutYourself: "",
  },
 });

 const [formData, setFormData] = useState({
  countryCode: "+62",
 });

 const watched = watch();
 const firstName = watched.firstName ?? "";
 const lastName = watched.lastName ?? "";

 // keep fullName in sync so zod resolver validates it
 useEffect(() => {
  const full = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
  setValue("fullName", full);
 }, [firstName, lastName]);

 const onSubmit = async (data: FormValues) => {
  try {
   const payload: RegisterData = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    phoneNumber: data.phoneNumber || "",
    country: data.country || "",
    aboutYourself: data.aboutYourself || "",
   };

   await registerMutation.mutateAsync(payload);
   router.push("/dashboard");
  } catch (error) {
   // Error handling is done in the hook
  }
 };

 return (
  <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-gray-50 dark:bg-gray-900">
   {/* rotated background (behind content) */}
   <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[120%] h-1/2 transform rotate-3 origin-top-right bg-white dark:bg-blue-900" />
   </div>

   {/* Header */}
   <div className="z-10 flex flex-col items-center justify-center gap-4 mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
     Register
    </h1>
    <p className="max-w-md text-sm font-light text-center text-gray-500 dark:text-gray-400">
     Let's Sign up first for enter into Square Website. Uh She Up!
    </p>
   </div>

   {/* Form */}
   <form
    onSubmit={handleSubmit(onSubmit)}
    className="z-10 w-full max-w-2xl p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl"
   >
    <div className="space-y-6">
     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
       <FloatingLabelInput
        label="First Name"
        type="text"
        value={watched.firstName}
        onChange={(e) => setValue("firstName", e.target.value)}
        className={clsx("w-full", errors.fullName && "border-red-500")}
       />
      </div>

      <div>
       <FloatingLabelInput
        label="Last Name"
        type="text"
        value={watched.lastName}
        onChange={(e) => setValue("lastName", e.target.value)}
        className={clsx("w-full", errors.fullName && "border-red-500")}
       />
      </div>
     </div>

     {errors.fullName && (
      <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
     )}

     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
       <PhoneInput
        countryCode={formData.countryCode}
        phoneNumber={watched.phoneNumber || ""}
        onCountryCodeChange={(code) =>
         setFormData({ ...formData, countryCode: code })
        }
        onPhoneNumberChange={(number) => setValue("phoneNumber", number)}
        className={clsx("w-full", errors.phoneNumber && "border-red-500")}
       />
       {errors.phoneNumber && (
        <p className="mt-1 text-sm text-red-500">
         {errors.phoneNumber.message}
        </p>
       )}
      </div>
      <div>
       <CountrySelect
        value={watched.country || ""}
        onChange={(country) => setValue("country", country)}
        className={clsx("w-full", errors.country && "border-red-500")}
       />
       {errors.country && (
        <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
       )}
      </div>
     </div>

     <div>
      <FloatingLabelInput
       label="Email Address"
       type="email"
       value={watched.email}
       onChange={(e) => setValue("email", e.target.value)}
       className={clsx("w-full", errors.email && "border-red-500")}
      />
      {errors.email && (
       <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
      )}
     </div>

     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
       <PasswordInput
        label="Password"
        value={watched.password}
        onChange={(e) => setValue("password", e.target.value)}
        className={clsx("w-full", errors.password && "border-red-500")}
       />
       {errors.password && (
        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
       )}
      </div>
      <div>
       <PasswordInput
        label="Confirm Password"
        value={watched.confirmPassword}
        onChange={(e) => setValue("confirmPassword", e.target.value)}
        className={clsx("w-full", errors.confirmPassword && "border-red-500")}
       />
       {errors.confirmPassword && (
        <p className="mt-1 text-sm text-red-500">
         {errors.confirmPassword.message}
        </p>
       )}
      </div>
     </div>

     <div>
      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
       Tell us about yourself
      </p>
      <Textarea
       label=""
       placeholder="Hello my name..."
       value={watched.aboutYourself || ""}
       onChange={(e) => setValue("aboutYourself", e.target.value)}
       rows={4}
       className={clsx("w-full", errors.aboutYourself && "border-red-500")}
      />
      {errors.aboutYourself && (
       <p className="mt-1 text-sm text-red-500">
        {errors.aboutYourself.message}
       </p>
      )}
     </div>

     <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
      <Link href="/login">
       <button
        type="button"
        className="w-full px-6 py-3 font-medium text-gray-700 transition-colors duration-200 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
       >
        Login
       </button>
      </Link>
      <button
       type="submit"
       disabled={registerMutation.isPending}
       className={clsx(
        "py-3 md:col-span-2 col-span-1 px-6 font-medium rounded-lg transition-colors duration-200",
        registerMutation.isPending
         ? "bg-gray-400 cursor-not-allowed text-gray-200"
         : "bg-blue-600 hover:bg-blue-700 text-white"
       )}
      >
       {registerMutation.isPending ? "Registering..." : "Register"}
      </button>
     </div>
    </div>
   </form>
  </div>
 );
};

export default Register;
