import { Bell } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
}

export function MobileHeader({ title, subtitle }: MobileHeaderProps) {
  return (
    <header className="px-5 pt-6 pb-4 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <button
        type="button"
        className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
      </button>
    </header>
  );
}
