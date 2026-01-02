import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/use-in-view";
export const CTA = () => {
  const {
    ref: sectionRef,
    isInView
  } = useInView({
    threshold: 0.2
  });
  return <section ref={sectionRef} className="py-24 bg-gradient-hero relative overflow-hidden">
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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-primary-foreground">
            Automatiza tus suscripciones
            <br />
            <span className="text-primary-foreground">y cobros recurrentes</span>
          </h2>
          
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Más de 100 empresas ya gestionan sus suscripciones con Walpay. Control total, análisis en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary border-0 hover:bg-white/90 text-lg px-8 py-6 h-auto transition-all duration-300 hover:scale-105 group shadow-strong">
                <Calendar className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Agendá una reunión
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-primary-foreground/60">
            Sin compromisos • Implementación en 24 horas • Soporte incluido
          </p>
        </div>
      </div>
    </section>;
};