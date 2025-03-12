'use client'

import React, { useState } from 'react';
import { Aperture } from "lucide-react";
import { redirect } from 'next/navigation';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface MenuItem {
  id: number;
  label: string;
  url: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const [activeItem, setActiveItem] = useState<number>(1);

  const baseStyle = "flex items-center gap-3 cursor-pointer rounded-lg py-3 px-3 text-lg transition-colors";

  return (
    <div className="w-60 min-h-screen bg-transparent border-r border-[#ffffff57] text-white p-2">
      <h1 className="mt-10 mb-20 text-3xl font-bold font-sans text-center tracking-tighter flex items-center gap-2">
        <Aperture size={35} />YT Connect
      </h1>
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <li
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                redirect(item.url);
              }}
              className={twMerge(clsx(baseStyle, { 'bg-zinc-800': isActive, 'hover:bg-transparent': !isActive }))}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
