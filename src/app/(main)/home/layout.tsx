import Sidebar from "@/components/ui/sidebar";
import { Bell, FileVideo, Settings, Users2 } from "lucide-react";

const menuItems = [
    {id: 1, label: "Projects", url: "/Projects", icon: <FileVideo />},
    {id: 2, label: "Team", url: "/team", icon: <Users2 />},
    {id: 3, label: "Notifications", url: "/notifications", icon: <Bell />},
    {id: 4, label: "Settings", url: "/settings", icon: <Settings />},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar menuItems={menuItems} />
      
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
