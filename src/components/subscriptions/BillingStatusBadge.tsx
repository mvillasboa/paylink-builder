import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, Ban, RefreshCw } from "lucide-react";
import { BillingStatus, BillingStatusLabels } from "@/types/subscription";

interface BillingStatusBadgeProps {
  status: BillingStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const statusConfig: Record<BillingStatus, { 
  className: string; 
  icon: React.ElementType;
}> = {
  IN_GOOD_STANDING: {
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  PAST_DUE: {
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  DELINQUENT: {
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
    icon: AlertCircle,
  },
  SUSPENDED: {
    className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30",
    icon: Ban,
  },
  RECOVERY: {
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    icon: RefreshCw,
  },
};

export function BillingStatusBadge({ status, size = "md", showIcon = true }: BillingStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === "sm" ? "text-xs py-0 px-1.5" : ""}`}
    >
      {showIcon && <Icon className={`${size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} mr-1`} />}
      {BillingStatusLabels[status]}
    </Badge>
  );
}
