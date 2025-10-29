import React, { useState } from "react";

interface CountrySelectProps {
 value?: string;
 onChange?: (value: string) => void;
 className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
 value = "",
 onChange,
 className = "",
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(value.length > 0);

 const countries = [
  { code: "ID", name: "Indonesia" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
 ];

 const handleFocus = () => setIsFocused(true);
 const handleBlur = () => setIsFocused(false);
 const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = e.target.value;
  setHasValue(selectedValue.length > 0);
  if (onChange) onChange(selectedValue);
 };

 return (
  <div className={`relative ${className}`}>
   <select
    value={value}
    onChange={handleChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
    className="w-full px-4 py-3 text-gray-900 transition-all duration-200 ease-in-out bg-white border-2 border-gray-300 rounded-lg outline-none appearance-none cursor-pointer dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
   >
    <option value="" disabled></option>
    {countries.map((country) => (
     <option key={country.code} value={country.code}>
      {country.name}
     </option>
    ))}
   </select>

   <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
    <svg
     className="w-5 h-5 text-gray-400"
     fill="none"
     stroke="currentColor"
     viewBox="0 0 24 24"
    >
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
     />
    </svg>
   </div>
   <label
    className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
     isFocused || hasValue
      ? "-top-3 text-sm bg-white dark:bg-gray-800 px-2 text-blue-500 dark:text-blue-400"
      : "top-3 text-base text-gray-500 dark:text-gray-400"
    }`}
   >
    Your Country
   </label>
  </div>
 );
};

export default CountrySelect;
