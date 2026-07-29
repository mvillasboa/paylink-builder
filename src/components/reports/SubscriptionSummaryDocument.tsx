import logoWpagos from "@/assets/wpagos-logo-mark.png.asset.json";
import { formatAmount } from "@/lib/utils/currency";
import type { SubscriptionReportData } from "@/data/mockSubscriptionReport";

const fmtDate = (date: Date) =>
  date.toLocaleDateString("es-PY", { day: "2-digit", month: "2-digit", year: "numeric" });

const fmtLongDate = (date: Date) =>
  date.toLocaleDateString("es-PY", { day: "numeric", month: "long", year: "numeric" });

const money = (n: number) => `Gs. ${formatAmount(n)}`;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-[13px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary border-b border-border pb-1.5 mb-3">
      {children}
    </h2>
  );
}

interface Props {
  data: SubscriptionReportData;
}

export function SubscriptionSummaryDocument({ data }: Props) {
  const { comercio, cliente, suscripcion, cuotas, soporte } = data;
  const pagadas = cuotas.filter((c) => c.estado === "pagada");
  const pendientes = cuotas.filter((c) => c.estado === "pendiente");
  const totalPagado = pagadas.reduce((s, c) => s + c.monto, 0);
  const totalPendiente = pendientes.reduce((s, c) => s + c.monto, 0);
  const progreso = cuotas.length ? (pagadas.length / cuotas.length) * 100 : 0;

  return (
    <article className="report-sheet bg-card text-foreground mx-auto w-full max-w-[794px] px-12 py-10 shadow-lg print:shadow-none print:max-w-none print:px-0 print:py-0">
      {/* Header */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-primary pb-4 mb-6">
        <img src={logoWpagos.url} alt="Wpagos" className="h-9 w-auto object-contain" />
        <div className="text-right">
          <h1 className="text-lg font-bold text-primary leading-tight">Resumen de suscripción</h1>
          <p className="text-[11px] text-muted-foreground">
            Emitido el {fmtLongDate(data.emitidoEl)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Referencia {suscripcion.referencia}
          </p>
        </div>
      </header>

      {/* Comercio + Cliente */}
      <div className="grid grid-cols-2 gap-8 mb-7">
        <section>
          <SectionTitle>Comercio</SectionTitle>
          <div className="space-y-2">
            <Field label="Nombre de fantasía" value={comercio.nombreFantasia} />
            <Field label="Razón social" value={comercio.razonSocial} />
            <Field label="RUC" value={comercio.ruc} />
            <Field
              label="Atención al cliente"
              value={`${comercio.contactoTelefono} · ${comercio.contactoEmail}`}
            />
          </div>
        </section>
        <section>
          <SectionTitle>Titular de la suscripción</SectionTitle>
          <div className="space-y-2">
            <Field label="Nombre" value={cliente.nombre} />
            <Field label="Documento" value={cliente.documento} />
            <Field label="Correo electrónico" value={cliente.email} />
            <Field
              label="Medio de pago"
              value={`${suscripcion.medioPago.marca} •••• ${suscripcion.medioPago.ultimos4}`}
            />
          </div>
        </section>
      </div>

      {/* Suscripción */}
      <section className="mb-7">
        <SectionTitle>Datos de la suscripción</SectionTitle>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between bg-muted/60 px-4 py-2.5">
            <div>
              <p className="text-[13px] font-semibold">{suscripcion.concepto}</p>
              <p className="text-[11px] text-muted-foreground">{suscripcion.detalle}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              {suscripcion.estado}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 px-4 py-4">
            <Field label="Monto por cuota" value={money(suscripcion.monto)} />
            <Field label="Frecuencia" value={suscripcion.frecuencia} />
            <Field label="Día de cobro" value={`Día ${suscripcion.diaCobro} de cada mes`} />
            <Field label="Inicio" value={fmtDate(suscripcion.fechaInicio)} />
            <Field
              label="Próximo cobro"
              value={suscripcion.proximoCobro ? fmtDate(suscripcion.proximoCobro) : "—"}
            />
            <Field label="Total de cuotas" value={`${cuotas.length} cuotas`} />
          </div>
        </div>
      </section>

      {/* Progreso */}
      <section className="mb-7">
        <SectionTitle>Progreso de cuotas</SectionTitle>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-1.5">
              <p className="text-[13px] font-semibold">
                {pagadas.length} de {cuotas.length} cuotas pagadas
              </p>
              <p className="text-[11px] text-muted-foreground">{Math.round(progreso)}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progreso}%` }} />
            </div>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pagado</p>
              <p className="text-[13px] font-bold text-primary">{money(totalPagado)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pendiente</p>
              <p className="text-[13px] font-bold">{money(totalPendiente)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuotas pagadas */}
      <section className="mb-6">
        <SectionTitle>Cuotas pagadas</SectionTitle>
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground text-left">
              <th className="px-3 py-2 font-semibold w-12">#</th>
              <th className="px-3 py-2 font-semibold">Vencimiento</th>
              <th className="px-3 py-2 font-semibold">Fecha de pago</th>
              <th className="px-3 py-2 font-semibold text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagadas.map((c) => (
              <tr key={c.numero} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-muted-foreground">{c.numero}</td>
                <td className="px-3 py-2">{fmtDate(c.vencimiento)}</td>
                <td className="px-3 py-2">{c.fechaPago ? fmtDate(c.fechaPago) : "—"}</td>
                <td className="px-3 py-2 text-right font-medium">{money(c.monto)}</td>
              </tr>
            ))}
            {pagadas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-3 text-muted-foreground">
                  Todavía no hay cuotas pagadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Cuotas pendientes */}
      <section className="mb-7">
        <SectionTitle>Cuotas pendientes</SectionTitle>
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-muted text-left">
              <th className="px-3 py-2 font-semibold w-12">#</th>
              <th className="px-3 py-2 font-semibold">Vencimiento</th>
              <th className="px-3 py-2 font-semibold text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.map((c) => (
              <tr key={c.numero} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-muted-foreground">{c.numero}</td>
                <td className="px-3 py-2">{fmtDate(c.vencimiento)}</td>
                <td className="px-3 py-2 text-right font-medium">{money(c.monto)}</td>
              </tr>
            ))}
            {pendientes.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-3 text-muted-foreground">
                  No quedan cuotas pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-4 space-y-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Consultas sobre el servicio contratado:</strong>{" "}
          comunicate con {comercio.nombreFantasia} al {comercio.contactoTelefono} o a{" "}
          {comercio.contactoEmail}. El servicio y sus condiciones son responsabilidad del comercio.
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Consultas sobre el cobro o el medio de pago:</strong>{" "}
          WhatsApp {soporte.whatsapp} · {soporte.horario}.
        </p>
        <p className="text-[10px] leading-relaxed text-muted-foreground pt-1">
          Walton Capital S.A. es la plataforma tecnológica que procesa los cobros recurrentes de este
          comercio. No almacenamos los datos sensibles de tu tarjeta: se resguardan tokenizados en el
          procesador de pagos. Este documento es un resumen informativo y no constituye un comprobante
          fiscal.
        </p>
      </footer>
    </article>
  );
}
