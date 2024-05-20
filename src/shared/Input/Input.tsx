import React, { InputHTMLAttributes, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  error?: boolean; // Asegúrate de incluir la prop 'error'
  errorMessage?: string; // Asegúrate de incluir la prop 'errorMessage'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "border-neutral-200",
      sizeClass = "h-11 px-4 py-3 border-neutral-200",
      fontClass = "text-sm font-normal",
      rounded = "rounded-2xl",
      error,
      errorMessage,
      ...rest
    },
    ref
  ) => {
    const { value } = rest;
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`block w-full border-neutral-200 focus:border-purple-600 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${rounded} ${fontClass} ${sizeClass} ${className}`}
          {...rest}
        />
        {error && typeof value === "string" && value.trim() !== "" && (
          <p className="absolute text-red-500 text-[9px] -bottom-5 right-0 whitespace-nowrap">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
