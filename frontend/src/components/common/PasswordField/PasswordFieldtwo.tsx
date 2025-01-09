import { Input } from "@/components/ui/input";
import { EyeClosed, EyeIcon } from "lucide-react";
import React, { useState, forwardRef } from "react";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Optional label for the input field
  error?: string; // Error message to display
  touched?: boolean; // Whether the field has been touched (optional for form libraries)
  className?: string; // Custom styling for the input
  containerClassName?: string; // Styling for the container
  showToggleIcon?: boolean; // Whether to show the password visibility toggle
}

const PasswordFieldTwo = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label,
      error,
      touched,
      className,
      containerClassName,
      showToggleIcon = true,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible((prev) => !prev);
    };

    return (
      <div className={`password-field ${containerClassName || ""}`}>
        {label && (
          <label htmlFor={props.id || props.name} className="block mb-1 text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            type={isPasswordVisible ? "text" : "password"}
            className={`input dark:border-slate-600 dark:bg-slate-700 ${className || ""} ${
              touched && error ? "border-red-500 dark:border-red-600" : ""
            }`}
            {...props} // Spread all other props (onChange, value, onBlur, etc.)
          />
          {showToggleIcon && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {isPasswordVisible ? <EyeIcon className='size-4 text-gray-400' /> : <EyeClosed className='size-4 text-gray-400' />}
            </button>
          )}
        </div>
        {touched && error && (
          <span className="text-xs text-red-500 dark:text-red-600">{error}</span>
        )}
      </div>
    );
  }
);

PasswordFieldTwo.displayName = "PasswordField";

export default PasswordFieldTwo;
