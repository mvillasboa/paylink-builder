import { useState } from "react";
import { MobileHeader } from "@/components/mobile-app/MobileHeader";
import { mockMobileSubscriptions, type MobileSubscription } from "@/data/mockMobileApp";
import { formatCurrency } from "@/lib/utils/currency";
import { Pause, X, Calendar, CreditCard, ChevronRight, ListChecks } from "lucide-react";

type Filter = "all" | "active" | "paused";

const statusLabels: Record<MobileSubscription["status"], { label: string; cls: string }> = {
  active: { label: "Activa", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  paused: { label: "Pausada", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  cancelled: { label: "Cancelada", cls: "bg-muted text-muted-foreground" },
};

export default function MobileSubscriptions() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<MobileSubscription | null>(null);

  const filtered = mockMobileSubscriptions.filter((s) =>
    filter === "all" ? true : s.status === filter
  );

  return (
    <div className="pb-4">
      <MobileHeader
        title="Suscripciones"
        subtitle={`${mockMobileSubscriptions.filter((s) => s.status === "active").length} activas`}
      />

      {/* Filters */}
      <div className="px-5 flex gap-2 mb-4">
        {(["all", "active", "paused"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {f === "all" ? "Todas" : f === "active" ? "Activas" : "Pausadas"}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="px-5 space-y-2">
        {filtered.map((sub) => {
          const st = statusLabels[sub.status];
          return (
            <li key={sub.id}>
              <button
                type="button"
                onClick={() => setSelected(sub)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">
                  {sub.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{sub.merchant}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {sub.concept} • {sub.frequency}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded ${st.cls}`}>
                      {st.label}
                    </span>
                    {sub.totalInstallments != null && (
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        {sub.paidInstallments ?? 0} de {sub.totalInstallments} cuotas
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{formatCurrency(sub.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {sub.nextChargeDate.toLocaleDateString("es-PY", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-12">
            Sin suscripciones en este filtro
          </li>
        )}
      </ul>

      {/* Detail bottom sheet */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-20 flex items-end sm:items-center sm:justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full sm:w-[374px] bg-background rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                {selected.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold truncate">{selected.merchant}</h3>
                <p className="text-xs text-muted-foreground">{selected.concept}</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 mb-4">
              <p className="text-xs text-muted-foreground">Monto {selected.frequency.toLowerCase()}</p>
              <p className="text-2xl font-bold">{formatCurrency(selected.amount)}</p>
            </div>

            {selected.totalInstallments != null && (
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Progreso de cuotas</p>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {selected.paidInstallments ?? 0} / {selected.totalInstallments}
                  </p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: `${((selected.paidInstallments ?? 0) / selected.totalInstallments) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {selected.totalInstallments - (selected.paidInstallments ?? 0)} cuotas restantes
                </p>
              </div>
            )}

            <ul className="space-y-3 text-sm mb-5">
              <li className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">Próximo cobro</span>
                <span className="font-medium">
                  {selected.nextChargeDate.toLocaleDateString("es-PY", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">Tarjeta</span>
                <span className="font-medium">
                  {selected.cardBrand.toUpperCase()} •••• {selected.cardLast4}
                </span>
              </li>
            </ul>

            <div className="space-y-2">
              {selected.status === "active" ? (
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Pause className="h-4 w-4" /> Pausar suscripción
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  Reanudar
                </button>
              )}
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" /> Cancelar suscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
