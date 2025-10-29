import React, { useState } from "react";

interface PasswordInputProps {
 label: string;
 value?: string;
 onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
 label,
 value = "",
 onChange,
 className = "",
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(value.length > 0);
 const [showPassword, setShowPassword] = useState(false);

 const handleFocus = () => setIsFocused(true);
 const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  setIsFocused(false);
  setHasValue(e.target.value.length > 0);
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setHasValue(e.target.value.length > 0);
  if (onChange) onChange(e);
 };

 const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
 };

 return (
  <div className={`relative ${className}`}>
   <input
    type={showPassword ? "text" : "password"}
    value={value}
    onChange={handleChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
    className="w-full px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-all duration-200 ease-in-out focus:border-blue-500 dark:focus:border-blue-400"
   />
   <button
    type="button"
    onClick={togglePasswordVisibility}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
   >
    {showPassword ? (
     <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
     </svg>
    ) : (
     <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       strokeWidth={2}
       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
     </svg>
    )}
   </button>
   <label
    className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
     isFocused || hasValue
      ? "-top-3 text-sm bg-white dark:bg-gray-800 px-2 text-blue-500 dark:text-blue-400"
      : "top-3 text-base text-gray-500 dark:text-gray-400"
    }`}
   >
    {label}
   </label>
  </div>
 );
};

export default PasswordInput;
