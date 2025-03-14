import Sidebar from "@/components/ui/sidebar";
import { Bell, FileVideo, Home, Settings, Users2 } from "lucide-react";

const menuItems = [
    {id: 1, label: "Home", url: "/home", icon: <Home />},
    {id: 2, label: "Projects", url: "/projects", icon: <FileVideo />},
    {id: 3, label: "Team", url: "/team", icon: <Users2 />},
    {id: 4, label: "Notifications", url: "/notifications", icon: <Bell />},
    {id: 5, label: "Settings", url: "/settings", icon: <Settings />},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar menuItems={menuItems} />
      
      <div className="flex-grow min-h-screen max-h-screen">
        {children}
      </div>
    </div>
  );
}
