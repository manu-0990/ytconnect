import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Bell, FileVideo, Gauge, Home, Users2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <AppSidebar />
      <div className="flex min-h-screen">
        <SidebarTrigger />
        {/* <div className="overflow-y-scroll flex-grow min-h-screen max-h-screen"> */}
          {children}
        {/* </div> */}
      </div>
    </SidebarProvider>
  );
}
