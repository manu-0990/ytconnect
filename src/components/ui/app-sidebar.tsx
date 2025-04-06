"use client"

import Link from "next/link"
import { CloudUpload, Home, Bell, Settings, UserCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: CloudUpload,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Account",
    url: "/account",
    icon: UserCircle2,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="text-gray-100 shadow-xl">
      <SidebarHeader className="py-6 px-14 text-3xl font-bold borde border-gray-700">
        YT CONNECT
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="mb-2">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={`flex items-center gap-4 text-lg p-3 min-h-[3rem] rounded transition-all duration-100 ${
                  pathname === item.url
                    ? "bg-gray-800 text-white border-l-4 border-slate-200"
                    : "hover:bg-gray-800"
                }`}
              >
                <Link href={item.url} className="flex items-center gap-4 w-full">
                  <item.icon className="w-6 h-6" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
