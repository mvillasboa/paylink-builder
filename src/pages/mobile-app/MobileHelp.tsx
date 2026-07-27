import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, MessageCircle, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  helpCategories,
  helpFaqs,
  helpSchedule,
  helpWhatsAppUrl,
} from "@/data/helpContent";


export default function MobileHelp() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = helpFaqs.filter((f) => {
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
          {helpCategories.map((c) => {
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
