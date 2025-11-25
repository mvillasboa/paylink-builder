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
      <div className="w-96 p-8 text-center">
        <p className="text-sm text-muted-foreground/70">Sin notificaciones</p>
      </div>
    );
  }

  return (
    <div className="w-96">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-medium text-sm text-foreground/90">
          Notificaciones
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs text-muted-foreground hover:text-foreground -mr-2"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Limpiar
        </Button>
      </div>

      <ScrollArea className="h-[420px]">
        <div className="px-2 pb-2">
          {notifications.map((notification) => {
            const config = notificationConfig[notification.type];
            return (
              <div
                key={notification.id}
                className="group px-3 py-3 mb-1 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer"
              >
                <div className="flex gap-3 items-start">
                  <div className="text-base flex-shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-sm font-medium ${config.color} leading-tight`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 pt-0.5">
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
