import { NavLink } from "react-router-dom";
import { Home, CreditCard, Repeat, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/app", label: "Inicio", icon: Home, end: true },
  { to: "/app/cards", label: "Tarjetas", icon: CreditCard },
  { to: "/app/subscriptions", label: "Suscrip.", icon: Repeat },
  { to: "/app/payments", label: "Pagos", icon: Receipt },
  { to: "/app/profile", label: "Perfil", icon: User },
];

export function MobileTabBar() {
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-background border-t border-border/60 backdrop-blur-lg z-10">
      <ul className="grid grid-cols-5 px-1 pt-2 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                    <span>{tab.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
