import React from "react";
import { cn } from "@/components/lib/utils"; 

type ButtonProps = {
  children: React.ReactNode;
  size?: "large" | "small";
  variant?: "primary" | "secondary" | "text";
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  size = "large",
  variant = "primary",
  disabled = false,
  icon,
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-poppins font-semibold transition-colors";

  const sizeStyles =
    size === "large"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2 text-sm";

  const variantStyles = {
    primary: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-400",
    text: "bg-transparent text-red-600 hover:text-red-700 disabled:text-gray-400",
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, sizeStyles, variantStyles)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
export { Button}