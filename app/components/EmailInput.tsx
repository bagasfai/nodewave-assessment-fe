import React, { useState } from "react";

interface EmailInputProps {
 domain?: string;
 emailPrefix?: string;
 onEmailPrefixChange?: (prefix: string) => void;
 className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
 domain = "@squareteam.com",
 emailPrefix = "",
 onEmailPrefixChange,
 className = "",
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(emailPrefix.length > 0);

 const handleFocus = () => setIsFocused(true);
 const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  setIsFocused(false);
  setHasValue(e.target.value.length > 0);
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setHasValue(e.target.value.length > 0);
  if (onEmailPrefixChange) onEmailPrefixChange(e.target.value);
 };

 return (
  <div className={`relative ${className}`}>
   <div className="relative">
    <input
     type="text"
     value={emailPrefix}
     onChange={handleChange}
     onFocus={handleFocus}
     onBlur={handleBlur}
     className="flex-1 px-4 w-full py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-all duration-200 ease-in-out focus:border-blue-500 dark:focus:border-blue-400"
    />
    <div className="px-4 py-3 absolute top-0 right-0 text-gray-900 dark:text-gray-100 flex items-center text-xs md:text-base">
     {domain}
    </div>
   </div>
   <label
    className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
     isFocused || hasValue
      ? "-top-3 text-sm bg-white dark:bg-gray-800 px-2 text-blue-500 dark:text-blue-400"
      : "top-3 text-base text-gray-500 dark:text-gray-400"
    }`}
   >
    Mail Address
   </label>
  </div>
 );
};

export default EmailInput;
