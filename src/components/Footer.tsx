import { CreditCard } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-light/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span>PayLink</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              La plataforma líder para registro seguro de tarjetas y pagos B2B
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Características</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Seguridad</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Integraciones</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          © {currentYear} PayLink. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
