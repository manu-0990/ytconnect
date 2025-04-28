"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios, { AxiosError } from "axios";
import { Bell, Loader2} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import NotificationItem from "../NotificationItem";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/NotificationItem";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!respondingId) setIsLoading(true);
    try {
      const response = await axios.get<{ data: Notification[] }>("/api/notifications");
      setNotifications(response.data.data || [])
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error.response?.data?.error || error.message);
      toast({
        description: "Failed to load notifications.",
        variant: "destructive"
      });
    } finally {
      if (!respondingId) setIsLoading(false);
    }
  }, [respondingId]);

  useEffect(() => {
    fetchNotifications();
    // Optional: Implement polling or real-time updates (e.g., WebSockets)
    // const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    // return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleRespond = useCallback(async (notificationId: number, action: 'accept' | 'decline') => {
    if (respondingId) return;

    setRespondingId(notificationId);

    try {
      const response = await axios.post("/api/user/respond", {
        notificationId,
        action,
      });

      toast({ description: response.data.message || `${action === 'accept' ? 'Accepted' : 'Declined'} successfully!` });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Optional: Re-fetch all notifications to ensure consistency,
      // especially if accepting/declining creates new notifications (like JOIN_ACCEPTED/REJECTED)
      // await fetchNotifications(); // Uncomment if needed, but might cause a flicker

    } catch (error: any) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || `Failed to ${action} invitation/request.`;
      console.error(`Failed to ${action}:`, errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setRespondingId(null);
    }
  }, [respondingId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          
          <Bell size={23} className="w-full h-full" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-1.5 items-center justify-center h-1.5 w-1.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          )}

        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] sm:w-[350px] md:w-[400px] max-h-[70vh] overflow-y-auto">
          <DropdownMenuLabel className="text-lg font-semibold">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading && notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRespond={handleRespond}
                isResponding={(id) => respondingId === id}
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
