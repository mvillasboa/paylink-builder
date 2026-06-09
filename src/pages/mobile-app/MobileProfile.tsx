import { MobileHeader } from "@/components/mobile-app/MobileHeader";
import { ChevronRight, Bell, Shield, HelpCircle, FileText, LogOut, Globe } from "lucide-react";

const sections = [
  {
    title: "Cuenta",
    items: [
      { icon: Bell, label: "Notificaciones" },
      { icon: Shield, label: "Seguridad y privacidad" },
      { icon: Globe, label: "Idioma", value: "Español" },
    ],
  },
  {
    title: "Soporte",
    items: [
      { icon: HelpCircle, label: "Centro de ayuda" },
      { icon: FileText, label: "Términos y condiciones" },
    ],
  },
];

export default function MobileProfile() {
  return (
    <div className="pb-4">
      <MobileHeader title="Perfil" />

      <section className="px-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            JP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold truncate">Juan Pérez García</p>
            <p className="text-xs text-muted-foreground truncate">juan.perez@email.com</p>
            <p className="text-xs text-muted-foreground">+595 981 234 567</p>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="px-5 mt-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
            {section.title}
          </h3>
          <ul className="rounded-xl bg-card border border-border divide-y divide-border overflow-hidden">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{item.label}</span>
                    {"value" in item && item.value && (
                      <span className="text-xs text-muted-foreground">{item.value}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="px-5 mt-6">
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
        <p className="text-center text-[10px] text-muted-foreground mt-4">Versión 1.0.0 (mockup)</p>
      </section>
    </div>
  );
}
