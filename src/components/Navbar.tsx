import { Button } from "@/components/ui/button";
import { CreditCard, Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>PayLink</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/features" className="text-foreground/70 hover:text-foreground transition-colors">
              Características
            </a>
            <a href="/how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
              Cómo Funciona
            </a>
            <a href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors">
              Precios
            </a>
            <a href="/contact" className="text-foreground/70 hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Iniciar Sesión
            </Button>
            <Button variant="hero" className="hidden sm:inline-flex">
              Comenzar Gratis
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
