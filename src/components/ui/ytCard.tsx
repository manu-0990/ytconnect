import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface YTCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  imageUrl: string;
  title: string;
  className?: string;
}

const baseStyle =
  " max-h-80 block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer";

const YTCard = React.forwardRef<HTMLAnchorElement, YTCardProps>(
  ({ imageUrl, title, className, ...props }, ref) => {
    return (
      <a ref={ref} className={twMerge(clsx(baseStyle, className))} {...props}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-4/5 rounded-lg object-cover"
        />
        <h2 className="py-2 px-1 text-left text-lg">{title}</h2>
      </a>
    );
  }
);

export default YTCard;
