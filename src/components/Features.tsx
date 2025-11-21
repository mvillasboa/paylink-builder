import { Card } from "@/components/ui/card";
import { Link2, Lock, Zap, CheckCircle, TrendingUp, Smartphone } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Links Personalizados",
    description: "Crea y envía links únicos para cada cliente. Controla el acceso y monitorea cada transacción en tiempo real.",
  },
  {
    icon: Lock,
    title: "Seguridad Bancaria",
    description: "Encriptación de nivel bancario y certificación PCI DSS. Tus clientes confían en la protección de sus datos.",
  },
  {
    icon: Zap,
    title: "Integración Rápida",
    description: "API moderna y documentación completa. Integra en minutos con tu sistema existente sin complicaciones.",
  },
  {
    icon: CheckCircle,
    title: "Validación Instantánea",
    description: "Verifica tarjetas al momento del registro. Reduce fraudes y rechazos antes de procesar pagos.",
  },
  {
    icon: TrendingUp,
    title: "Dashboard Analítico",
    description: "Visualiza métricas clave, tasas de conversión y comportamiento de pagos en tiempo real.",
  },
  {
    icon: Smartphone,
    title: "Experiencia Mobile",
    description: "Diseño responsive optimizado. Tus clientes registran sus tarjetas desde cualquier dispositivo.",
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
            Todo lo que necesitas para
            <span className="text-gradient"> procesar pagos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Una plataforma completa para gestionar el registro de tarjetas y pagos de tus clientes B2B
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
