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
        <p className="text-xs text-muted-foreground/60">Sin notificaciones</p>
      </div>
    );
  }

  return (
    <div className="w-96">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <h3 className="font-medium text-xs text-foreground/80">
          Notificaciones
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 text-[10px] text-muted-foreground hover:text-foreground -mr-2"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Limpiar
        </Button>
      </div>

      <ScrollArea className="h-[420px]">
        <div className="px-2 py-2">
          {notifications.map((notification, index) => {
            const config = notificationConfig[notification.type];
            return (
              <div key={notification.id}>
                <div
                  className="group px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex gap-2.5 items-start">
                    <div className="text-sm flex-shrink-0 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className={`text-xs font-medium ${config.color} leading-tight`}>
                        {notification.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 leading-snug">
                        {notification.message}
                      </p>
                      <p className="text-[9px] text-muted-foreground/50 pt-0.5">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <div className="h-px bg-border/30 mx-3 my-1" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
