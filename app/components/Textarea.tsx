import React, { useState } from "react";

interface TextareaProps {
 label: string;
 placeholder?: string;
 value?: string;
 onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 rows?: number;
 className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
 label,
 placeholder = "",
 value = "",
 onChange,
 rows = 4,
 className = "",
}) => {
 const [isFocused, setIsFocused] = useState(false);
 const [hasValue, setHasValue] = useState(value.length > 0);

 const handleFocus = () => setIsFocused(true);
 const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
  setIsFocused(false);
  setHasValue(e.target.value.length > 0);
 };

 const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setHasValue(e.target.value.length > 0);
  if (onChange) onChange(e);
 };

 return (
  <div className={`relative ${className}`}>
   <textarea
    value={value}
    onChange={handleChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg outline-none transition-all duration-200 ease-in-out focus:border-blue-500 dark:focus:border-blue-400 resize-vertical"
   />
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

export default Textarea;
