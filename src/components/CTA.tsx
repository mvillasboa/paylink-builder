import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-primary-foreground">
            Automatiza tus suscripciones
            <br />
            <span className="text-gradient">y cobros recurrentes</span>
          </h2>
          
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Más de 100 empresas ya gestionan sus suscripciones con PayLink Pro. Control total, análisis en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="cta" size="lg" className="group text-lg px-8 py-6 h-auto">
              Solicitar Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 h-auto"
            >
              <Mail className="w-5 h-5" />
              Contactar Ventas
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-primary-foreground/60">
            Sin compromisos • Implementación en 24 horas • Soporte incluido
          </p>
        </div>
      </div>
    </section>
  );
};
