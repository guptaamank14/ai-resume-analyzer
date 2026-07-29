import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  leftIcon = null,
  rightIcon = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-400 dark:text-slate-500 inline-flex">
            {leftIcon}
          </span>
        )}

        <input
          name={name}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full text-sm font-medium py-2.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon || isPassword ? 'pr-10' : 'pr-3.5'}
            ${error 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50 dark:border-red-900/50 dark:focus:ring-red-950/40' 
              : 'border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-950/20'
            }
            disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-950
          `}
          {...props}
        />

        {/* Password Eye icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}

        {/* Regular right icon */}
        {!isPassword && rightIcon && (
          <span className="absolute right-3.5 text-slate-400 dark:text-slate-500 inline-flex">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-xs font-semibold text-red-500">{error}</span>}
      {!error && hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
};

export default Input;
