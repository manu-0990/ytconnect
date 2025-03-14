"use client";

import React from "react";
import { Component, UserCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const profilePic = session?.user?.image;

  const baseStyle =
    "flex items-center gap-3 cursor-pointer rounded-lg py-3 px-3 text-lg transition-colors";

  return (
    <div className="w-60 min-h-screen bg-transparent border-r border-[#ffffff57] text-white p-2 flex flex-col justify-between">
      <div>
        <h1 className="mt-10 mb-20 text-3xl font-bold font-sans text-center tracking-tighter flex items-center gap-2">
          <Component size={35} />
          YT Connect
        </h1>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.url; // Set active based on URL
            return (
              <li
                key={item.id}
                onClick={() => router.push(item.url)}
                className={twMerge(
                  clsx(baseStyle, {
                    "bg-zinc-800": isActive,
                    "hover:bg-transparent": !isActive,
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
        onClick={() => router.push("/account")}
        className={twMerge(
          clsx(baseStyle, {
            "bg-zinc-800": pathname === "/account",
            "hover:bg-zinc-800": pathname !== "/account",
          })
        )}
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
    </div>
  );
};

export default Sidebar;
