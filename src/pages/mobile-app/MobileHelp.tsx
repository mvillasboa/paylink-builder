import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  MessageCircle,
  Search,
  CreditCard,
  Repeat,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WHATSAPP_URL = "https://wa.me/595981234567?text=Hola,%20necesito%20ayuda%20con%20mi%20cuenta";

const categories = [
  { icon: CreditCard, label: "Tarjetas" },
  { icon: Repeat, label: "Suscripciones" },
  { icon: Receipt, label: "Pagos" },
  { icon: ShieldCheck, label: "Seguridad" },
];

const faqs = [
  {
    category: "Tarjetas",
    question: "¿Cómo registro una tarjeta para pagos recurrentes?",
    answer:
      "Ingresá al link de suscripción que te envía el comercio, completá los datos de tu tarjeta y confirmá. Vas a recibir un correo de confirmación y la tarjeta aparecerá en la sección Tarjetas.",
  },
  {
    category: "Tarjetas",
    question: "¿Cómo inactivo una tarjeta?",
    answer:
      "Entrá a Tarjetas, seleccioná la tarjeta y elegí 'Inactivar'. La tarjeta dejará de usarse para cobros recurrentes, pero seguís siendo responsable de los servicios ya contratados con el comercio.",
  },
  {
    category: "Suscripciones",
    question: "¿Puedo cancelar una suscripción desde la app?",
    answer:
      "Podés inactivar el medio de pago desde la app. La baja del servicio se gestiona directamente con el comercio, ya que la relación contractual es con ellos.",
  },
  {
    category: "Suscripciones",
    question: "¿Qué pasa si el comercio cambia el monto?",
    answer:
      "Recibirás una notificación y un correo para autorizar el nuevo monto. El cobro no se realiza hasta que apruebes el cambio.",
  },
  {
    category: "Pagos",
    question: "¿Por qué falló mi último cobro?",
    answer:
      "Los motivos más comunes son fondos insuficientes, tarjeta vencida o bloqueo del banco emisor. Verificá con tu banco y actualizá la tarjeta desde la sección Tarjetas.",
  },
  {
    category: "Pagos",
    question: "¿Dónde veo mis comprobantes?",
    answer:
      "En la sección Pagos encontrás el historial completo. Cada pago exitoso también se envía por correo electrónico.",
  },
  {
    category: "Seguridad",
    question: "¿Mis datos de tarjeta están seguros?",
    answer:
      "Nunca almacenamos el número completo de tu tarjeta. Los datos se tokenizan bajo estándares PCI DSS y solo se muestran los últimos 4 dígitos.",
  },
  {
    category: "Seguridad",
    question: "No reconozco un cobro, ¿qué hago?",
    answer:
      "Escribinos por WhatsApp desde esta pantalla indicando la fecha y el monto. Nuestro equipo revisará la operación y te acompañará en el reclamo.",
  },
];

export default function MobileHelp() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = faqs.filter((f) => {
    const matchesQuery =
      !query ||
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || f.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/app/profile")}
          aria-label="Volver"
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Centro de ayuda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Resolvé tus dudas al instante</p>
        </div>
      </header>

      <section className="px-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una consulta"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </section>

      <section className="px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = category === c.label;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => setCategory(active ? null : c.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5 mt-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No encontramos resultados. Consultá con un operador por WhatsApp.
          </p>
        ) : (
          <Accordion type="single" collapsible className="rounded-xl bg-card border border-border overflow-hidden">
            {filtered.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="px-4 border-border">
                <AccordionTrigger className="text-sm text-left py-3.5">{f.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3.5">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">¿No encontraste lo que buscabas?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Hablá directamente con un operador. Atención de lunes a viernes de 8:00 a 18:00.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-3 rounded-xl bg-[hsl(var(--mint))] text-[hsl(var(--mint-foreground))] text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
