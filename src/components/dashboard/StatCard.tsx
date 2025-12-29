import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  format?: 'currency' | 'number' | 'percentage';
}

export function StatCard({ title, value, change, icon: Icon, format = 'number' }: StatCardProps) {
  const isPositive = change >= 0;
  
  const formattedValue = () => {
    if (format === 'currency') {
      return `₲ ${Number(value).toLocaleString('es-PY')}`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString('es-PY');
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-medium">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {formattedValue()}
            </p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpIcon className="h-3.5 w-3.5 text-accent" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isPositive ? "text-accent" : "text-destructive"
              )}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
