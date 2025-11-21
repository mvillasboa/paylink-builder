import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserPlus, Link2, CreditCard, CheckCircle } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const steps = [
  {
    icon: UserPlus,
    title: "1. Crea tu cuenta",
    description: "Regístrate en minutos y configura tu perfil de negocio",
    details: [
      "Sin contratos a largo plazo",
      "Sin costos de configuración",
      "Aprobación instantánea"
    ]
  },
  {
    icon: Link2,
    title: "2. Genera tu link de pago",
    description: "Crea links personalizados para tus productos o servicios",
    details: [
      "Configuración flexible",
      "Diseño personalizable",
      "URLs amigables"
    ]
  },
  {
    icon: CreditCard,
    title: "3. Comparte y cobra",
    description: "Envía el link a tus clientes y recibe pagos automáticamente",
    details: [
      "Múltiples métodos de pago",
      "Notificaciones en tiempo real",
      "Conciliación automática"
    ]
  },
  {
    icon: CheckCircle,
    title: "4. Gestiona y crece",
    description: "Monitorea tus ingresos y optimiza tus suscripciones",
    details: [
      "Dashboard completo",
      "Reportes detallados",
      "Análisis de métricas"
    ]
  }
];

export default function HowItWorksPage() {
  const { ref: headerRef, isInView: isHeaderInView } = useInView();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div 
            ref={headerRef}
            className={`max-w-3xl mx-auto text-center scroll-fade-up ${isHeaderInView ? 'in-view' : ''}`}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              ¿Cómo <span className="text-gradient">Funciona</span>?
            </h1>
            <p className="text-xl text-muted-foreground">
              Comienza a cobrar en 4 simples pasos. Sin complicaciones, sin tecnología compleja.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-20">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} isReversed={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
              Todo el proceso en <span className="text-gradient">minutos</span>
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary" />
              
              <div className="space-y-12">
                {[
                  { time: "0 min", text: "Registro y verificación" },
                  { time: "2 min", text: "Configuración de cuenta" },
                  { time: "5 min", text: "Creación de primer link" },
                  { time: "7 min", text: "¡Listo para recibir pagos!" }
                ].map((item, idx) => (
                  <TimelineItem key={idx} time={item.time} text={item.text} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete a PayLink hoy y transforma la manera en que cobras
            </p>
            <button className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-strong hover:shadow-glow">
              Comenzar Ahora
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StepCard({ step, index, isReversed }: { step: typeof steps[0], index: number, isReversed: boolean }) {
  const { ref: cardRef, isInView } = useInView();
  const Icon = step.icon;

  return (
    <div
      ref={cardRef}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-12 scroll-fade-up ${isInView ? 'in-view' : ''}`}
    >
      <div className="lg:w-1/2">
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-strong">
          <Icon className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h3 className="text-3xl font-bold mb-4 text-foreground">{step.title}</h3>
        <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
        
        <ul className="space-y-3">
          {step.details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="lg:w-1/2">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12 border border-border/50">
          <div className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center">
            <Icon className="w-24 h-24 text-primary/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ time, text, index }: { time: string, text: string, index: number }) {
  const { ref: itemRef, isInView } = useInView();

  return (
    <div
      ref={itemRef}
      className={`flex items-center justify-between scroll-fade-up ${isInView ? 'in-view' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="flex-1 text-right pr-8">
        <div className="inline-block bg-card border border-border/50 rounded-lg px-6 py-3 shadow-soft">
          <span className="text-sm font-semibold text-primary">{time}</span>
        </div>
      </div>
      
      <div className="w-4 h-4 rounded-full bg-gradient-primary shadow-strong relative z-10" />
      
      <div className="flex-1 pl-8">
        <div className="inline-block bg-card border border-border/50 rounded-lg px-6 py-3 shadow-soft">
          <span className="text-sm font-medium text-foreground">{text}</span>
        </div>
      </div>
    </div>
  );
}
