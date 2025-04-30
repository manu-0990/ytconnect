"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios, { AxiosError } from "axios";
import { Bell, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import NotificationItem from "../NotificationItem";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/NotificationItem";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const { toast } = useToast();
  const hasMarkedRead = useRef(false);

  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!respondingId && showLoading) setIsLoading(true);
    try {
      const response = await axios.get<{ data: Notification[] }>("/api/notifications");
      setNotifications(response.data.data || []);
      hasMarkedRead.current = false;
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error.response?.data?.error || error.message);
      toast({
        description: "Failed to load notifications.",
        variant: "destructive"
      });
    } finally {
      if (!respondingId && showLoading) setIsLoading(false);
    }
  }, [respondingId, toast]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 60000); //  <------ Polling of 1 min
    return () => clearInterval(interval);
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
      await fetchNotifications(false);

    } catch (error: any) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || `Failed to ${action} invitation/request.`;
      console.error(`Failed to ${action}:`, errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive"
      });
      await fetchNotifications(false);
    } finally {
      setRespondingId(null);
    }
  }, [respondingId, toast, fetchNotifications]);

  const markNotificationsAsRead = useCallback(async (idsToMark: number[]) => {
    if (idsToMark.length === 0) return;

    const originalNotifications = [...notifications];
    setNotifications((prev) =>
      prev.map((n) =>
        idsToMark.includes(n.id) ? { ...n, read: true } : n
      )
    );
    hasMarkedRead.current = true;

    try {
      await axios.post('/api/notifications/mark-as-read', { notificationIds: idsToMark });
      await fetchNotifications(false);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      setNotifications(originalNotifications);
      hasMarkedRead.current = false;
      toast({
        title: "Error",
        description: "Could not update notification status.",
        variant: "destructive",
      });
    }
  }, [notifications]);


  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDropdownOpenChange = (open: boolean) => {
    if (open && unreadCount > 0 && !hasMarkedRead.current) {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      markNotificationsAsRead(unreadIds);
    }
    if (!open) {
      hasMarkedRead.current = false;
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger className="relative" aria-label="Open Notifications">
          <Bell size={25} className="w-full h-full" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
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