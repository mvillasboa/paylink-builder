import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { PaymentMethodStatus, PaymentMethodStatusLabels } from "@/types/subscription";

interface PaymentMethodStatusBadgeProps {
  status: PaymentMethodStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<PaymentMethodStatus, { 
  className: string; 
  icon: React.ElementType;
}> = {
  VALID: {
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  TEMPORARILY_INVALID: {
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  INVALID: {
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

export function PaymentMethodStatusBadge({ status, size = "md" }: PaymentMethodStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === "sm" ? "text-xs py-0 px-1.5" : ""}`}
    >
      <Icon className={`${size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} mr-1`} />
      {PaymentMethodStatusLabels[status]}
    </Badge>
  );
}
