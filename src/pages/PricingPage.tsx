import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, X } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfecto para empezar",
    features: [
      { text: "Hasta 10 transacciones/mes", included: true },
      { text: "1 link de pago", included: true },
      { text: "Comisión 3.5% + IVA", included: true },
      { text: "Dashboard básico", included: true },
      { text: "Soporte por email", included: true },
      { text: "API access", included: false },
      { text: "Reportes avanzados", included: false },
      { text: "Soporte prioritario", included: false }
    ],
    cta: "Comenzar Gratis",
    popular: false
  },
  {
    name: "Professional",
    price: "29",
    description: "Para negocios en crecimiento",
    features: [
      { text: "Hasta 100 transacciones/mes", included: true },
      { text: "Links ilimitados", included: true },
      { text: "Comisión 2.9% + IVA", included: true },
      { text: "Dashboard completo", included: true },
      { text: "API completa", included: true },
      { text: "Reportes avanzados", included: true },
      { text: "Soporte prioritario", included: true },
      { text: "Webhooks", included: true }
    ],
    cta: "Comenzar Prueba",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Soluciones a medida",
    features: [
      { text: "Transacciones ilimitadas", included: true },
      { text: "Links ilimitados", included: true },
      { text: "Comisión negociable", included: true },
      { text: "Dashboard personalizado", included: true },
      { text: "API dedicada", included: true },
      { text: "Reportes personalizados", included: true },
      { text: "Soporte 24/7", included: true },
      { text: "Account manager", included: true }
    ],
    cta: "Contactar Ventas",
    popular: false
  }
];

const faqs = [
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu dashboard. Los cambios se aplican inmediatamente."
  },
  {
    question: "¿Hay costos ocultos?",
    answer: "No. Solo pagas la suscripción mensual y las comisiones por transacción. Sin costos de activación ni cargos sorpresa."
  },
  {
    question: "¿Cuánto tarda en procesarse un pago?",
    answer: "Los pagos se procesan instantáneamente. Los fondos están disponibles en tu cuenta en 1-2 días hábiles."
  },
  {
    question: "¿Ofrecen período de prueba?",
    answer: "Sí, el plan Professional incluye 14 días de prueba gratuita. No se requiere tarjeta de crédito."
  }
];

export default function PricingPage() {
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
              Precios <span className="text-gradient">Transparentes</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sin sorpresas. Sin letras pequeñas. Solo precios justos que crecen con tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
              Compara todos los <span className="text-gradient">planes</span>
            </h2>
            
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Característica</th>
                      <th className="text-center p-4 font-semibold text-foreground">Starter</th>
                      <th className="text-center p-4 font-semibold text-foreground">Professional</th>
                      <th className="text-center p-4 font-semibold text-foreground">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="p-4 text-muted-foreground">Transacciones mensuales</td>
                      <td className="p-4 text-center text-foreground">10</td>
                      <td className="p-4 text-center text-foreground">100</td>
                      <td className="p-4 text-center text-foreground">Ilimitadas</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="p-4 text-muted-foreground">Links de pago</td>
                      <td className="p-4 text-center text-foreground">1</td>
                      <td className="p-4 text-center text-foreground">Ilimitados</td>
                      <td className="p-4 text-center text-foreground">Ilimitados</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-muted-foreground">Comisión por transacción</td>
                      <td className="p-4 text-center text-foreground">3.5%</td>
                      <td className="p-4 text-center text-foreground">2.9%</td>
                      <td className="p-4 text-center text-foreground">Personalizada</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-foreground">
              Preguntas <span className="text-gradient">Frecuentes</span>
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PricingCard({ plan, index }: { plan: typeof plans[0], index: number }) {
  const { ref: cardRef, isInView } = useInView();

  return (
    <div
      ref={cardRef}
      className={`relative bg-card border ${plan.popular ? 'border-primary shadow-glow' : 'border-border/50'} rounded-xl p-8 scroll-fade-up ${isInView ? 'in-view' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-strong">
          Más Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          {plan.price !== "Custom" && <span className="text-3xl font-bold text-foreground">$</span>}
          <span className="text-5xl font-bold text-foreground">{plan.price}</span>
          {plan.price !== "Custom" && <span className="text-muted-foreground">/mes</span>}
        </div>
      </div>
      
      <button className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all ${
        plan.popular 
          ? 'bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium hover:shadow-glow' 
          : 'bg-muted text-foreground hover:bg-muted/80'
      }`}>
        {plan.cta}
      </button>
      
      <ul className="space-y-3">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ faq, index }: { faq: typeof faqs[0], index: number }) {
  const { ref: itemRef, isInView } = useInView();

  return (
    <div
      ref={itemRef}
      className={`bg-card border border-border/50 rounded-xl p-6 scroll-fade-up ${isInView ? 'in-view' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <h3 className="text-lg font-semibold mb-2 text-foreground">{faq.question}</h3>
      <p className="text-muted-foreground">{faq.answer}</p>
    </div>
  );
}
