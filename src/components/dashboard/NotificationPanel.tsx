import { DashboardNotification, notificationConfig } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";

interface NotificationPanelProps {
  notifications: DashboardNotification[];
  onClearAll: () => void;
}

export function NotificationPanel({
  notifications,
  onClearAll,
}: NotificationPanelProps) {
  if (notifications.length === 0) {
    return (
      <div className="w-80 p-6 text-center text-muted-foreground">
        <p className="text-sm">No hay notificaciones</p>
      </div>
    );
  }

  return (
    <div className="w-80">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">
          Notificaciones
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Limpiar
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-border">
          {notifications.map((notification) => {
            const config = notificationConfig[notification.type];
            return (
              <div
                key={notification.id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-3">
                  <div className="text-xl flex-shrink-0">{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${config.color}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
