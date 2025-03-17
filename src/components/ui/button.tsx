import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "small" | "medium" | "large";
}

const variants = {
  small: "text-sm font-thin px-3 py-2",
  medium: "text-base px-5 py-2",
  large: "text-lg px-8 py-3",
};

const baseStyles = "bg-[#3a3a3a] text-white px-4 py-2 rounded transition-colors duration-200 flex gap-3 hover:bg-[#4a4a4a] disabled:opacity-50 disabled:cursor-not-allowed";

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  ...rest
}) => {
  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
