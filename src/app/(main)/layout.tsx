import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <AppSidebar />
      <div className="flex flex-grow min-h-screen">
        {/* <SidebarTrigger /> */}
        {children}
      </div>
    </SidebarProvider>
  );
}
