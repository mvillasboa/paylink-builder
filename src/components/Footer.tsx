import logoWalpayWhite from "@/assets/logo-walpay-white.jpg";
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-primary text-primary-foreground py-12 border-t border-primary-light/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img alt="Walpay" className="h-10 w-auto" src="/lovable-uploads/a3bf07a1-25cb-4348-ac8b-ee5a6267f999.png" />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              La plataforma líder para registro seguro de tarjetas y gestión de pagos recurrentes
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Características</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Seguridad</a></li>
              <li><a href="/my-cards" className="hover:text-primary-foreground transition-colors">Mis Tarjetas</a></li>
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
          © {currentYear} Walpay. Todos los derechos reservados.
        </div>
      </div>
    </footer>;
};