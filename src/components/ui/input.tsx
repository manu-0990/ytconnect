import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const baseStyles =
  "w-full rounded-md bg-[#3a3a3a] border-none px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500";

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = `Enter your ${label.toLowerCase()} here...`,
  className,
  debounceMs = 300,
  onChange,
  ...props
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && debounceMs > 0) {
      timerRef.current && clearTimeout(timerRef.current);
      e.persist();
      timerRef.current = setTimeout(() => onChange(e), debounceMs);
    } else {
      onChange?.(e);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-lg font-medium text-gray-200">{label}</label>
      <input
        placeholder={placeholder}
        {...props}
        onChange={handleChange}
        className={twMerge(clsx(baseStyles, className))}
      />
    </div>
  );
};

export default InputField;
