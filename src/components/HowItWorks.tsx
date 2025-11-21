import { Card } from "@/components/ui/card";
import { Send, CreditCard, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Send,
    number: "01",
    title: "Envía el Link",
    description: "Genera un link seguro y personalizado desde tu dashboard. Envíalo por email, SMS o tu canal preferido.",
  },
  {
    icon: CreditCard,
    number: "02",
    title: "Cliente Registra Tarjeta",
    description: "Tu cliente accede al link, ingresa los datos de su tarjeta en un formulario seguro y validado.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Comienza a Cobrar",
    description: "La tarjeta queda registrada de forma segura. Procesa pagos recurrentes o únicos cuando lo necesites.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Tres pasos para
            <span className="text-gradient"> empezar a cobrar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Un proceso simple y transparente que tus clientes amarán
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[calc(100%+1rem)] w-8 h-0.5 bg-gradient-to-r from-secondary to-transparent" />
              )}
              
              <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 relative">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-medium">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
