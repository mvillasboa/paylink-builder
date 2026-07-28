import { CreditCard, Repeat, Receipt, ShieldCheck, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * CONTENIDO DEL CENTRO DE AYUDA (/app/help)
 * -----------------------------------------
 * Editá únicamente este archivo para cambiar textos, agregar o quitar preguntas.
 * No hace falta tocar la pantalla.
 */

/** Botón de WhatsApp: número en formato internacional, sin "+" ni espacios. */
export const helpWhatsApp = {
  phone: "595986777222",
  message: "Hola, necesito ayuda con mi cuenta",
};

/** URL final del botón (se arma sola, no editar). */
export const helpWhatsAppUrl = `https://wa.me/${helpWhatsApp.phone}?text=${encodeURIComponent(
  helpWhatsApp.message,
)}`;

/** Horario de atención mostrado en el bloque de contacto. */
export const helpSchedule = "Atención de lunes a viernes de 8:00 a 17:00.";

/** Íconos disponibles por categoría. Si una categoría no está acá, usa el ícono por defecto. */
export const helpCategoryIcons: Record<string, LucideIcon> = {
  Tarjetas: CreditCard,
  Suscripciones: Repeat,
  Pagos: Receipt,
  Seguridad: ShieldCheck,
};

export const helpDefaultIcon: LucideIcon = HelpCircle;

export interface HelpFaq {
  category: string;
  question: string;
  answer: string;
}

/**
 * Preguntas frecuentes. Para agregar una, copiá un bloque y cambiá los textos.
 * El orden de los filtros de categoría sigue el orden de aparición en esta lista.
 */
export const helpFaqs: HelpFaq[] = [
  // ── Tarjetas ────────────────────────────────────────────────
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
      "Entrá a Tarjetas, seleccioná la tarjeta y elegí 'Eliminar tarjeta'. La tarjeta dejará de usarse para cobros recurrentes, pero seguís siendo responsable de los servicios ya contratados con el comercio.",
  },

  // ── Suscripciones ───────────────────────────────────────────
  {
    category: "Suscripciones",
    question: "¿Puedo cancelar una suscripción desde la app?",
    answer:
      "Podés inactivar el medio de pago desde la app. La baja del servicio se gestiona directamente con el comercio, ya que la relación contractual es con ellos.",
  },

  // ── Pagos ───────────────────────────────────────────────────
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

  // ── Seguridad ───────────────────────────────────────────────
  {
    category: "Seguridad",
    question: "¿Mis datos de tarjeta están seguros?",
    answer:
      "Nunca almacenamos el número completo de tu tarjeta ni el CVV. El registro se realiza mediante tokenización con el procesador de pagos y en la app solo se muestran los últimos 4 dígitos.",
  },
  {
    category: "Seguridad",
    question: "No reconozco un cobro, ¿qué hago?",
    answer:
      "Escribinos por WhatsApp desde esta pantalla indicando la fecha y el monto. Nuestro equipo revisará la operación y te acompañará en el reclamo.",
  },
];

/** Categorías derivadas de las FAQs cargadas (no editar). */
export const helpCategories = Array.from(new Set(helpFaqs.map((f) => f.category))).map(
  (label) => ({
    label,
    icon: helpCategoryIcons[label] ?? helpDefaultIcon,
  }),
);
