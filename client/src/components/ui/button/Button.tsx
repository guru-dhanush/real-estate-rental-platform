import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "gradient"
  | "glass"
  | "none";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = "md",
  type = "button",
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "px-2 py-1.5 text-xs font-medium",
    sm: "px-3 py-2 text-sm font-medium",
    md: "px-4 py-2.5 text-sm font-semibold",
    lg: "px-5 py-3 text-base font-semibold",
    xl: "px-6 py-3.5 text-lg font-semibold",
  };

  // Rounded Classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  // Variant Classes
  const variantClasses = {
    none: "", // Empty string for no default styling
    primary:
      "bg-[#004B93] text-white shadow-sm hover:bg-[#004B93] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-[#004B93] disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-[#004B93]",
    secondary:
      "bg-gray-600 text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-800 disabled:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600",
    outline:
      "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-200 disabled:text-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700",
    destructive:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800 disabled:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600",
    success:
      "bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 disabled:bg-green-300 dark:bg-green-500 dark:hover:bg-green-600",
    warning:
      "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 active:bg-yellow-700 disabled:bg-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700",
    gradient:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:from-purple-700 active:to-pink-700 disabled:from-purple-300 disabled:to-pink-300",
    glass:
      "bg-white/20 backdrop-blur-sm border border-white/30 text-gray-900 shadow-lg hover:bg-white/30 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 active:bg-white/40 disabled:bg-white/10 disabled:text-gray-500 dark:text-white dark:border-white/20 dark:hover:bg-white/20",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`
        flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "cursor-not-allowed opacity-60 hover:scale-100 active:scale-100" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
    >
      {loading && <LoadingSpinner />}
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;