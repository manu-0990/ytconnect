"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { NotificationType } from "@prisma/client";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  recipientId: number;
  senderId: number | null;
  read: boolean;
  createdAt: string;
  projectId: number | null;
  sender: {
    image: string | null;
    name: string | null;
    id: number;
  } | null;
}

interface NotificationItemProps {
  notification: Notification;
  onRespond: (notificationId: number, action: 'accept' | 'decline') => Promise<void>;
  isResponding: (notificationId: number) => boolean;
}

export default function NotificationItem({ notification, onRespond, isResponding }: NotificationItemProps) {

  const { id, message, type, sender } = notification;
  const isActionable = type === NotificationType.EDITOR_INVITE || type === NotificationType.EDITOR_JOIN_REQUEST;
  const responding = isResponding(id);

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRespond(id, 'accept');
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRespond(id, 'decline');
  };

  // Fallback for sender image/name if sender is null (e.g., system alerts)
  const senderImage = sender?.image ?? '/ytconnect-default.png';
  const senderName = sender?.name ?? 'User';

  return (
    <DropdownMenuItem
      key={id}
      className={`flex items-center space-x-2 py-2 h-auto ${responding ? 'opacity-50 cursor-not-allowed' : ''}`}
      onSelect={(e) => e.preventDefault()}
    >
      <img
        src={senderImage}
        alt={senderName}
        className="h-9 w-9 rounded-full flex-shrink-0"
        onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
      />
      <div className="flex-grow space-y-1">
        <p className="text-sm truncate whitespace-normal leading-tight">{message}</p>
        {isActionable && !responding && (
          <div className="flex space-x-2 pt-1">
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={responding}
              className="bemerald-500"
            >
              <Check className="h-3 w-2" /> Accept
            </Button>
            <Button
              size="sm"
              onClick={handleDecline}
              disabled={responding}
              className="bg-rose-500 hover:bg-rose-600"
            >
              <X className="h-3 w-2" /> Decline
            </Button>
          </div>
        )}
        {responding && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

    </DropdownMenuItem>
  );
};