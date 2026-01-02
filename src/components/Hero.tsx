import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";
import dashboardImage from "@/assets/dashboard-hero.jpg";

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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-full text-sm font-medium text-secondary">
              <Zap className="w-4 h-4" />
              Plataforma de Pagos Inteligente
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary-foreground">Gestiona suscripciones</span>
              <br />
              <span className="text-gradient">y cobros recurrentes</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-xl">
              Plataforma completa para gestionar suscripciones, cobros recurrentes y links de pago. 
              Control total de tu flujo de ingresos con estadísticas en tiempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="cta" size="lg" className="group">
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Conocer Más
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
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
          
          {/* Right Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-strong border border-border/50">
              <img 
                src={dashboardImage} 
                alt="Dashboard de Walpay mostrando estadísticas de suscripciones y transacciones" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-strong p-6 backdrop-blur-sm border border-border animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">100% Seguro</p>
                  <p className="text-sm text-muted-foreground">Protección total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
