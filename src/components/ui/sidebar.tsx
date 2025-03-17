"use client";

import React, { useState } from "react";
import { Component, UserCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Account from "../account/page";

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
  const [isAccOpen, setIsAccOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const profilePic = session?.user?.image;

  const baseStyle =
    "flex items-center gap-3 cursor-pointer rounded-lg py-3 px-3 text-lg transition-colors";

  return (
    <div className="sticky top-0 bottom-0 flex-shrink-0 bg-[#212121] min-w-72 max-w-60 h-screen text-white py-2 px-5 flex flex-col justify-between">
      <div>
        <div className="w-full mt-10 mb-20 text-3xl font-bold font-sans text-center tracking-tighter flex items-center gap-2">
          <Component size={35} />
          YT Connect
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li
                key={item.id}
                onClick={() => router.push(item.url)}
                className={twMerge(
                  clsx(baseStyle, {
                    "bg-zinc-800": isActive,
                    "hover:bg-zinc-900": !isActive,
                  })
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        onClick={() => {
          setIsAccOpen(b => !b);
        }}
        className={twMerge(clsx(baseStyle, "hover:bg-zinc-800"))}
      >
        <span className="mr-2">
          {profilePic ? (
            <Image
              src={profilePic}
              alt="Profile Picture"
              width={35}
              height={35}
              className="rounded-full"
            />
          ) : (
            <UserCircle />
          )}
        </span>
        Account
      </div>
      
      <Account  isOpen={isAccOpen} onClose={() => setIsAccOpen(false)} />
    </div>
  );
};

export default Sidebar;
