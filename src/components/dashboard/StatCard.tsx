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
      return `$${Number(value).toLocaleString('es-MX')}`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toLocaleString('es-MX');
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {formattedValue()}
            </p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-accent" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "text-sm font-medium",
                isPositive ? "text-accent" : "text-destructive"
              )}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
