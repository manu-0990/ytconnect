import Sidebar from "@/components/ui/sidebar";
import { Bell, FileVideo, Gauge, Home, Users2 } from "lucide-react";

const menuItems = [
    {id: 1, label: "Home", url: "/home", icon: <Home />},
    {id: 2, label: "Projects", url: "/projects", icon: <FileVideo />},
    {id: 3, label: "Team", url: "/team", icon: <Users2 />},
    {id: 4, label: "Notifications", url: "/notifications", icon: <Bell />},
    // {id: 5, label: "Ongoing", url: "/ongoing", icon: <Gauge />},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar menuItems={menuItems} />
      
      <div className="overflow-y-scroll flex-grow min-h-screen max-h-screen">
        {children}
      </div>
    </div>
  );
}
