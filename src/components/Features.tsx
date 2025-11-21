import { Card } from "@/components/ui/card";
import { Link2, Lock, RefreshCw, BellRing, BarChart3, Settings } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Suscripciones Recurrentes",
    description: "Gestiona suscripciones fijas, variables o únicas. Cobros automáticos programados con total flexibilidad.",
  },
  {
    icon: Link2,
    title: "Links de Pago",
    description: "Crea links personalizados para tus clientes. Registran su tarjeta una vez y cobras cuando necesites.",
  },
  {
    icon: Settings,
    title: "Cambios de Precio",
    description: "Modifica precios de suscripciones con aprobación del cliente. Todo documentado y transparente.",
  },
  {
    icon: BellRing,
    title: "Notificaciones Automáticas",
    description: "WhatsApp y email automáticos para cambios, cobros y confirmaciones. Mantén informados a tus clientes.",
  },
  {
    icon: BarChart3,
    title: "Analytics en Tiempo Real",
    description: "Dashboard completo con métricas de ingresos, conversión, transacciones y estado de suscripciones.",
  },
  {
    icon: Lock,
    title: "Seguridad Total",
    description: "Certificación PCI DSS Nivel 1 y encriptación de extremo a extremo. Tus datos y los de tus clientes protegidos.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, currentColor 1px, transparent 0), linear-gradient(currentColor 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Plataforma completa
            <span className="text-gradient"> para B2B</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Todo lo que necesitas para gestionar suscripciones, cobros recurrentes y pagos en un solo lugar
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
