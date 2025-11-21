import { CheckCircle, Send, CreditCard, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Activity {
  id: number;
  type: 'card_registered' | 'link_sent' | 'payment_completed' | 'link_viewed';
  message: string;
  time: Date;
}

interface ActivityItemProps {
  activity: Activity;
}

const iconMap = {
  card_registered: CheckCircle,
  link_sent: Send,
  payment_completed: CreditCard,
  link_viewed: Eye,
};

const colorMap = {
  card_registered: 'text-accent',
  link_sent: 'text-primary',
  payment_completed: 'text-accent',
  link_viewed: 'text-secondary',
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = iconMap[activity.type];
  const iconColor = colorMap[activity.type];

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium">{activity.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(activity.time, { addSuffix: true, locale: es })}
        </p>
      </div>
    </div>
  );
}
