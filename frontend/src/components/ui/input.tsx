import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || props.name;
    
    // If using label, error, leftIcon or rightIcon, use the old wrapper style
    if (label || leftIcon || rightIcon) {
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">{leftIcon}</span>
              </div>
            )}
            <input
              id={inputId}
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-danger-300 focus-visible:ring-danger-500',
                className
              )}
              ref={ref}
              {...props}
            />
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400">{rightIcon}</span>
              </div>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-danger-600">{error}</p>
          )}
        </div>
      );
    }
    
    // Otherwise use the simpler shadcn style
    return (
      <input
        id={inputId}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && 'border-danger-300 focus-visible:ring-danger-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input;
