import React, { useState } from "react";

interface PhoneInputProps {
 countryCode?: string;
 phoneNumber?: string;
 onCountryCodeChange?: (code: string) => void;
 onPhoneNumberChange?: (number: string) => void;
 className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
 countryCode = "+62",
 phoneNumber = "",
 onCountryCodeChange,
 onPhoneNumberChange,
 className = "",
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(phoneNumber.length > 0);

 const handlePhoneFocus = () => setIsFocused(true);
 const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  setIsFocused(false);
  setHasValue(e.target.value.length > 0);
 };

 const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setHasValue(e.target.value.length > 0);
  if (onPhoneNumberChange) onPhoneNumberChange(e.target.value);
 };

 return (
  <div className={`relative ${className}`}>
   <div className="flex gap-2">
    <input
     type="text"
     value={countryCode}
     onChange={(e) => onCountryCodeChange?.(e.target.value)}
     className="w-14 px-3 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-all duration-200 ease-in-out focus:border-blue-500 dark:focus:border-blue-400 text-center"
    />
    <div className="relative w-full">
     <input
      type="tel"
      value={phoneNumber}
      onChange={handlePhoneChange}
      onFocus={handlePhoneFocus}
      onBlur={handlePhoneBlur}
      className="flex-1 px-3 py-3 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-all duration-200 ease-in-out focus:border-blue-500 dark:focus:border-blue-400"
     />
     <label
      className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
       isFocused || hasValue
        ? "-top-3 text-sm bg-white dark:bg-gray-800 px-2 text-blue-500 dark:text-blue-400"
        : "top-3 text-base text-gray-500 dark:text-gray-400"
      }`}
     >
      Phone Number
     </label>
    </div>
   </div>
  </div>
 );
};

export default PhoneInput;
