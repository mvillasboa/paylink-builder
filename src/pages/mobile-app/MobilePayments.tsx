import { useMemo, useState } from "react";
import { MobileHeader } from "@/components/mobile-app/MobileHeader";
import { mockMobilePayments, type MobilePayment } from "@/data/mockMobileApp";
import { formatCurrency } from "@/lib/utils/currency";
import { CheckCircle2, Clock, XCircle, Search } from "lucide-react";

const statusConfig: Record<
  MobilePayment["status"],
  { label: string; cls: string; Icon: typeof CheckCircle2 }
> = {
  completed: {
    label: "Pagado",
    cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pendiente",
    cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Icon: Clock,
  },
  failed: {
    label: "Fallido",
    cls: "bg-red-500/10 text-red-700 dark:text-red-400",
    Icon: XCircle,
  },
};

function monthKey(d: Date) {
  return d.toLocaleDateString("es-PY", { month: "long", year: "numeric" });
}

export default function MobilePayments() {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = mockMobilePayments.filter((p) =>
      query ? p.merchant.toLowerCase().includes(query.toLowerCase()) : true
    );
    const map = new Map<string, MobilePayment[]>();
    for (const p of filtered) {
      const k = monthKey(p.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
    return Array.from(map.entries());
  }, [query]);

  const totalMonth = mockMobilePayments
    .filter((p) => {
      const now = new Date();
      return (
        p.date.getMonth() === now.getMonth() &&
        p.date.getFullYear() === now.getFullYear() &&
        p.status === "completed"
      );
    })
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="pb-4">
      <MobileHeader title="Pagos" subtitle="Tu historial de transacciones" />

      {/* Month summary */}
      <section className="px-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground p-5">
          <p className="text-xs opacity-80">Pagado este mes</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(totalMonth)}</p>
          <p className="text-xs opacity-80 mt-2">
            {mockMobilePayments.filter((p) => p.status === "completed").length} transacciones
            exitosas
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="px-5 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por comercio..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </section>

      {/* Grouped list */}
      <section className="mt-4 space-y-5">
        {grouped.map(([month, items]) => (
          <div key={month}>
            <h3 className="px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {month}
            </h3>
            <ul className="px-5 space-y-2">
              {items.map((p) => {
                const st = statusConfig[p.status];
                const Icon = st.Icon;
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${st.cls}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.merchant}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.concept} • •••• {p.cardLast4}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          p.status === "failed" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {formatCurrency(p.amount)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.date.toLocaleDateString("es-PY", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">Sin resultados</p>
        )}
      </section>
    </div>
  );
}
