import { Link } from "react-router-dom";
import { MobileHeader } from "@/components/mobile-app/MobileHeader";
import { CardBrandLogo } from "@/components/mobile-app/CardBrandLogo";
import { mockSavedCards } from "@/data/mockCards";
import { mockMobileSubscriptions, mockMobilePayments } from "@/data/mockMobileApp";
import { formatCurrency } from "@/lib/utils/currency";
import { ChevronRight, TrendingUp, CalendarClock, CreditCard, Repeat } from "lucide-react";

export default function MobileHome() {
  const defaultCard = mockSavedCards.find((c) => c.isDefault) ?? mockSavedCards[0];
  const activeSubs = mockMobileSubscriptions.filter((s) => s.status === "active");
  const monthlyTotal = activeSubs
    .filter((s) => s.frequency === "Mensual")
    .reduce((sum, s) => sum + s.amount, 0);
  const upcoming = [...activeSubs].sort(
    (a, b) => a.nextChargeDate.getTime() - b.nextChargeDate.getTime()
  )[0];
  const recentPayments = mockMobilePayments.slice(0, 3);

  return (
    <div className="pb-4">
      <MobileHeader title="Hola, Juan 👋" subtitle="Bienvenido de vuelta" />

      {/* Default card preview */}
      <section className="px-5">
        <Link to="/app/cards" className="block">
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground shadow-lg overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-12 top-8 w-24 h-24 rounded-full bg-white/5" />
            <div className="relative">
              <p className="text-xs opacity-80">Tarjeta principal</p>
              <p className="text-lg font-mono tracking-wider mt-6">
                •••• •••• •••• {defaultCard.lastFourDigits}
              </p>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-[10px] opacity-70 uppercase">Titular</p>
                  <p className="text-sm font-medium truncate max-w-[180px]">
                    {defaultCard.cardholderName}
                  </p>
                </div>
                <CardBrandLogo brand={defaultCard.cardBrand} className="text-lg" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick stats */}
      <section className="px-5 mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Repeat className="h-4 w-4" />
          </div>
          <p className="text-xs text-muted-foreground">Suscripciones activas</p>
          <p className="text-xl font-bold mt-0.5">{activeSubs.length}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2">
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-xs text-muted-foreground">Gasto mensual</p>
          <p className="text-xl font-bold mt-0.5">{formatCurrency(monthlyTotal)}</p>
        </div>
      </section>

      {/* Upcoming charge */}
      {upcoming && (
        <section className="px-5 mt-5">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Próximo cobro</p>
              <p className="text-sm font-semibold truncate">{upcoming.merchant}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatCurrency(upcoming.amount)} •{" "}
                {upcoming.nextChargeDate.toLocaleDateString("es-PY", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recent payments */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Pagos recientes</h2>
          <Link to="/app/payments" className="text-xs text-primary font-medium flex items-center">
            Ver todos <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="space-y-2">
          {recentPayments.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.merchant}</p>
                <p className="text-xs text-muted-foreground">
                  {p.date.toLocaleDateString("es-PY", { day: "numeric", month: "short" })} ••••{" "}
                  {p.cardLast4}
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(p.amount)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
