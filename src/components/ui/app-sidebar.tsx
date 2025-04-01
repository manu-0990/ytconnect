import { Users2, Home, FileVideo, Bell, Settings, UserCircle2 } from "lucide-react"

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
    title: "Projects",
    url: "/projects",
    icon: FileVideo,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users2,
  },
  {
    title: "Notifications",
    url: "notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  {
    title: "Account",
    url: "account",
    icon: UserCircle2,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="text-3xl font-bold" >YT Connect</SidebarHeader>
      <SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
