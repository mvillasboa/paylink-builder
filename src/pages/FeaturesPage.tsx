import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreditCard, Shield, Zap, BarChart3, Users, Clock, CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const features = [
  {
    icon: CreditCard,
    title: "Pagos Recurrentes",
    description: "Automatiza cobros mensuales, trimestrales o anuales. Gestiona suscripciones con total flexibilidad.",
    benefits: [
      "Configuración en minutos",
      "Múltiples frecuencias de pago",
      "Gestión de pruebas gratuitas"
    ]
  },
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description: "Protección de nivel bancario con cifrado end-to-end y cumplimiento PCI DSS.",
    benefits: [
      "Certificación PCI DSS Level 1",
      "Cifrado SSL/TLS",
      "Detección de fraudes automática"
    ]
  },
  {
    icon: Zap,
    title: "Integración Rápida",
    description: "API moderna y documentación completa para integrar en minutos, no días.",
    benefits: [
      "SDK en múltiples lenguajes",
      "Webhooks en tiempo real",
      "Testing sandbox incluido"
    ]
  },
  {
    icon: BarChart3,
    title: "Analytics Avanzados",
    description: "Métricas detalladas y reportes en tiempo real para tomar mejores decisiones.",
    benefits: [
      "Dashboard interactivo",
      "Reportes personalizables",
      "Exportación de datos"
    ]
  },
  {
    icon: Users,
    title: "Gestión de Clientes",
    description: "Base de datos centralizada con historial completo de transacciones.",
    benefits: [
      "Perfiles de cliente detallados",
      "Historial de pagos",
      "Segmentación avanzada"
    ]
  },
  {
    icon: Clock,
    title: "Automatización Total",
    description: "Recordatorios automáticos, reintentos de pago y facturación programada.",
    benefits: [
      "Notificaciones personalizables",
      "Reintentos inteligentes",
      "Facturación automática"
    ]
  }
];

export default function FeaturesPage() {
  const { ref: headerRef, isInView: isHeaderInView } = useInView();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div 
            ref={headerRef}
            className={`max-w-3xl mx-auto text-center scroll-fade-up ${isHeaderInView ? 'in-view' : ''}`}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Características que <span className="text-gradient">Impulsan tu Negocio</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Todo lo que necesitas para gestionar pagos recurrentes y suscripciones en una sola plataforma
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a cientos de empresas que ya confían en PayLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-strong hover:shadow-glow">
                Comenzar Gratis
              </button>
              <button className="px-8 py-4 bg-background border border-border rounded-lg font-semibold hover:bg-muted transition-all">
                Agendar Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const { ref: cardRef, isInView } = useInView();
  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      className={`bg-card border border-border/50 rounded-xl p-8 hover:shadow-strong transition-all duration-300 scroll-fade-up ${isInView ? 'in-view' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
      <p className="text-muted-foreground mb-6">{feature.description}</p>
      
      <ul className="space-y-3">
        {feature.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
