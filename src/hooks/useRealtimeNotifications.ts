import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardNotification, NotificationType } from "@/types/notification";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const MAX_NOTIFICATIONS = 20;

// Mock notifications para visualización
const mockNotifications: DashboardNotification[] = [
  {
    id: "mock-1",
    type: "payment_completed",
    title: "Pago Completado",
    message: "Juan Pérez pagó $15,000",
    priority: "medium",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // hace 5 minutos
  },
  {
    id: "mock-2",
    type: "subscription_created",
    title: "Nueva Suscripción",
    message: "María García se ha suscrito a Plan Premium",
    priority: "medium",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // hace 15 minutos
  },
  {
    id: "mock-3",
    type: "payment_failed",
    title: "Pago Fallido",
    message: "El pago de Carlos López por $25,000 falló",
    priority: "high",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
  },
  {
    id: "mock-4",
    type: "subscription_paused",
    title: "Suscripción Pausada",
    message: "Ana Rodríguez pausó su suscripción",
    priority: "low",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // hace 1 hora
  },
  {
    id: "mock-5",
    type: "price_change_approved",
    title: "Cambio de Precio Aprobado",
    message: "Cliente aprobó cambio de precio",
    priority: "medium",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
  },
  {
    id: "mock-6",
    type: "subscription_cancelled",
    title: "Suscripción Cancelada",
    message: "Pedro Martínez canceló su suscripción",
    priority: "high",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // hace 3 horas
  },
  {
    id: "mock-7",
    type: "subscription_reactivated",
    title: "Suscripción Reactivada",
    message: "Laura Sánchez reactivó su suscripción",
    priority: "medium",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // hace 5 horas
  },
];

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.length);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subscriptions",
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const subscription = payload.new;
          addNotification({
            id: `sub-${subscription.id}`,
            type: "subscription_created",
            title: "Nueva Suscripción",
            message: `${subscription.client_name} se ha suscrito a ${subscription.concept}`,
            priority: "medium",
            timestamp: new Date(),
            data: subscription,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscriptions",
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const subscription = payload.new;
          const oldSubscription = payload.old as any;

          if (subscription.status !== oldSubscription?.status) {
            if (subscription.status === "cancelled") {
              addNotification({
                id: `sub-cancelled-${subscription.id}`,
                type: "subscription_cancelled",
                title: "Suscripción Cancelada",
                message: `${subscription.client_name} canceló su suscripción`,
                priority: "high",
                timestamp: new Date(),
                data: subscription,
              });
            } else if (subscription.status === "paused") {
              addNotification({
                id: `sub-paused-${subscription.id}`,
                type: "subscription_paused",
                title: "Suscripción Pausada",
                message: `${subscription.client_name} pausó su suscripción`,
                priority: "low",
                timestamp: new Date(),
                data: subscription,
              });
            } else if (
              subscription.status === "active" &&
              oldSubscription?.status === "paused"
            ) {
              addNotification({
                id: `sub-reactivated-${subscription.id}`,
                type: "subscription_reactivated",
                title: "Suscripción Reactivada",
                message: `${subscription.client_name} reactivó su suscripción`,
                priority: "medium",
                timestamp: new Date(),
                data: subscription,
              });
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const transaction = payload.new;

          if (transaction.status === "failed") {
            addNotification({
              id: `tx-failed-${transaction.id}`,
              type: "payment_failed",
              title: "Pago Fallido",
              message: `El pago de ${transaction.client_name} por $${(transaction.amount / 100).toLocaleString()} falló`,
              priority: "high",
              timestamp: new Date(),
              data: transaction,
            });
          } else if (transaction.status === "completed") {
            addNotification({
              id: `tx-completed-${transaction.id}`,
              type: "payment_completed",
              title: "Pago Completado",
              message: `${transaction.client_name} pagó $${(transaction.amount / 100).toLocaleString()}`,
              priority: "medium",
              timestamp: new Date(),
              data: transaction,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscription_price_changes",
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          const priceChange = payload.new;
          const oldPriceChange = payload.old as any;

          if (
            priceChange.client_approval_status !==
            oldPriceChange?.client_approval_status
          ) {
            if (priceChange.client_approval_status === "approved") {
              addNotification({
                id: `price-approved-${priceChange.id}`,
                type: "price_change_approved",
                title: "Cambio de Precio Aprobado",
                message: `Cliente aprobó cambio de precio`,
                priority: "medium",
                timestamp: new Date(),
                data: priceChange,
              });
            } else if (priceChange.client_approval_status === "rejected") {
              addNotification({
                id: `price-rejected-${priceChange.id}`,
                type: "price_change_rejected",
                title: "Cambio de Precio Rechazado",
                message: `Cliente rechazó cambio de precio`,
                priority: "high",
                timestamp: new Date(),
                data: priceChange,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (notification: DashboardNotification) => {
    setNotifications((prev) => {
      const newNotifications = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
      return newNotifications;
    });
    setUnreadCount((prev) => prev + 1);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    clearAll,
    markAsRead,
  };
}
