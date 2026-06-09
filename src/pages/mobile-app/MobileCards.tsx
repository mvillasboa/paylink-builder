import { useState } from "react";
import { MobileHeader } from "@/components/mobile-app/MobileHeader";
import { CardBrandLogo } from "@/components/mobile-app/CardBrandLogo";
import { mockSavedCards, cardBrandNames } from "@/data/mockCards";
import { Plus, MoreVertical, Star } from "lucide-react";

const gradients: Record<string, string> = {
  visa: "from-primary via-primary to-secondary",
  mastercard: "from-orange-500 via-red-500 to-pink-600",
  amex: "from-slate-700 via-slate-800 to-slate-900",
  discover: "from-orange-400 to-orange-600",
};

export default function MobileCards() {
  const [selectedId, setSelectedId] = useState(mockSavedCards[0].id);
  const selected = mockSavedCards.find((c) => c.id === selectedId)!;

  return (
    <div className="pb-4">
      <MobileHeader title="Mis tarjetas" subtitle={`${mockSavedCards.length} guardadas`} />

      {/* Carousel of cards */}
      <section className="px-5">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 scrollbar-none">
          {mockSavedCards.map((card) => {
            const grad = gradients[card.cardBrand] ?? gradients.visa;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedId(card.id)}
                className={`relative flex-shrink-0 w-[280px] h-[170px] rounded-2xl p-5 text-left text-white shadow-lg snap-center bg-gradient-to-br ${grad} ${
                  selectedId === card.id ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                {card.isDefault && (
                  <span className="absolute top-3 right-3 text-[10px] bg-white/20 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-current" /> Principal
                  </span>
                )}
                <div className="relative h-full flex flex-col justify-between">
                  <p className="text-xs opacity-80">{cardBrandNames[card.cardBrand]}</p>
                  <p className="text-lg font-mono tracking-wider">
                    •••• {card.lastFourDigits}
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] opacity-80">
                      Vence {card.expiryMonth}/{card.expiryYear}
                    </p>
                    <CardBrandLogo brand={card.cardBrand} className="text-sm" />
                  </div>
                </div>
              </button>
            );
          })}
          {/* Add card */}
          <button
            type="button"
            className="flex-shrink-0 w-[280px] h-[170px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground snap-center"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Agregar tarjeta</span>
          </button>
        </div>
      </section>

      {/* Selected card details */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Detalles</h2>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            aria-label="Más opciones"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl bg-card border border-border divide-y divide-border">
          <Row label="Titular" value={selected.cardholderName} />
          <Row label="Número" value={`•••• •••• •••• ${selected.lastFourDigits}`} />
          <Row label="Vencimiento" value={`${selected.expiryMonth}/${selected.expiryYear}`} />
          <Row label="Marca" value={cardBrandNames[selected.cardBrand]} />
          <Row
            label="Agregada"
            value={selected.addedDate.toLocaleDateString("es-PY", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          {selected.lastUsed && (
            <Row
              label="Último uso"
              value={selected.lastUsed.toLocaleDateString("es-PY", {
                day: "numeric",
                month: "long",
              })}
            />
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {!selected.isDefault && (
            <button
              type="button"
              className="col-span-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Hacer principal
            </button>
          )}
          <button
            type="button"
            className="col-span-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20"
          >
            Eliminar tarjeta
          </button>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
