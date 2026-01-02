import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import logoWalpay from "@/assets/logo-walpay.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-slide-up">
          {/* Prominent Logo */}
          <div className="flex justify-center">
            <img 
              src={logoWalpay} 
              alt="Walpay" 
              className="h-32 sm:h-40 lg:h-48 w-auto rounded-2xl shadow-strong"
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-primary-foreground">Gestiona suscripciones</span>
            <br />
            <span className="text-gradient">y cobros recurrentes</span>
          </h1>
          
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
            Plataforma completa para gestionar suscripciones, cobros recurrentes y links de pago. 
            Control total de tu flujo de ingresos con estadísticas en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" className="group">
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="flex items-center gap-8 justify-center pt-4">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Certificación PCI DSS</span>
            </div>
            <div className="h-4 w-px bg-primary-foreground/20" />
            <div className="text-sm font-medium text-primary-foreground/70">
              Encriptación de extremo a extremo
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
