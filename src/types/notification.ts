export type NotificationType =
  | "subscription_created"
  | "subscription_cancelled"
  | "subscription_paused"
  | "subscription_reactivated"
  | "payment_completed"
  | "payment_failed"
  | "price_change_approved"
  | "price_change_rejected";

export type NotificationPriority = "high" | "medium" | "low";

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: Date;
  data?: Record<string, any>;
}

export const notificationConfig: Record<
  NotificationType,
  { icon: string; priority: NotificationPriority; color: string }
> = {
  subscription_created: {
    icon: "✅",
    priority: "medium",
    color: "text-green-600",
  },
  subscription_cancelled: {
    icon: "⚠️",
    priority: "high",
    color: "text-destructive",
  },
  subscription_paused: {
    icon: "⏸️",
    priority: "low",
    color: "text-muted-foreground",
  },
  subscription_reactivated: {
    icon: "🔄",
    priority: "medium",
    color: "text-blue-600",
  },
  payment_completed: {
    icon: "💰",
    priority: "medium",
    color: "text-green-600",
  },
  payment_failed: {
    icon: "❌",
    priority: "high",
    color: "text-destructive",
  },
  price_change_approved: {
    icon: "✓",
    priority: "medium",
    color: "text-green-600",
  },
  price_change_rejected: {
    icon: "✗",
    priority: "high",
    color: "text-destructive",
  },
};
