
import React, { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { messageService } from "../services/MessageService";

interface Notification {
  id: string;
  type: 'group_message' | 'direct_message';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  groupId?: string;
  senderId?: string;
  receiverId?: string;
}

interface NotificationButtonProps {
  currentUserId: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ currentUserId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Subscribe to notifications from the message service
    const handleNotification = (notificationData: any) => {
      // Only show notification if it's for the current user
      if (notificationData.receiverId && notificationData.receiverId !== currentUserId) {
        return;
      }

      const newNotification: Notification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        timestamp: notificationData.timestamp,
        isRead: false,
        groupId: notificationData.groupId,
        senderId: notificationData.senderId,
        receiverId: notificationData.receiverId
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show toast notification
      toast({
        title: notificationData.title,
        description: notificationData.message,
        variant: "default",
      });

      // TODO: API Integration Point
      // Send notification to backend for persistence:
      // fetch('/api/notifications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newNotification)
      // });
    };

    messageService.subscribeToNotifications(handleNotification);

    // TODO: API Integration Point
    // Load existing notifications from backend:
    // fetch(`/api/notifications/${currentUserId}`)
    //   .then(response => response.json())
    //   .then(notifications => setNotifications(notifications));

    return () => {
      messageService.unsubscribeFromNotifications(handleNotification);
    };
  }, [currentUserId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // TODO: API Integration Point
    // Update notification status on backend:
    // fetch(`/api/notifications/${notificationId}/read`, {
    //   method: 'PUT'
    // });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );

    // TODO: API Integration Point
    // Mark all notifications as read on backend:
    // fetch(`/api/notifications/${currentUserId}/read-all`, {
    //   method: 'PUT'
    // });
  };

  const clearNotifications = () => {
    setNotifications([]);

    // TODO: API Integration Point
    // Clear notifications on backend:
    // fetch(`/api/notifications/${currentUserId}`, {
    //   method: 'DELETE'
    // });
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tout marquer lu
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs"
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    notification.isRead 
                      ? 'bg-background hover:bg-accent' 
                      : 'bg-primary/10 hover:bg-primary/20'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
