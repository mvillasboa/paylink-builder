import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hola@paylink.com",
    description: "Respuesta en 24 horas"
  },
  {
    icon: Phone,
    title: "Teléfono",
    value: "+595 21 123 456",
    description: "Lun - Vie, 9:00 - 18:00"
  },
  {
    icon: MapPin,
    title: "Oficina",
    value: "Asunción, Paraguay",
    description: "Av. Mariscal López 1234"
  }
];

export default function ContactPage() {
  const { ref: headerRef, isInView: isHeaderInView } = useInView();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de envío
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    
    // Limpiar formulario
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              Hablemos de tu <span className="text-gradient">Proyecto</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aquí para ayudarte. Cuéntanos cómo podemos impulsar tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <ContactInfoCard key={index} info={info} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Juan Pérez"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@empresa.com"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+595 981 123 456"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Empresa *
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Tu Empresa S.A."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-foreground mb-2">
                      Cargo *
                    </label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      placeholder="Director de Finanzas"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Cuéntanos sobre tu proyecto..."
                      rows={5}
                      className="w-full"
                    />
                  </div>
                  
                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </div>

              {/* Additional Info */}
              <div className="lg:pl-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">¿Por qué contactarnos?</h3>
                
                <div className="space-y-6">
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-2">Demo personalizada</h4>
                    <p className="text-sm text-muted-foreground">
                      Agenda una demo para ver cómo PayLink puede adaptarse a tu negocio específico.
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-2">Soporte técnico</h4>
                    <p className="text-sm text-muted-foreground">
                      Nuestro equipo técnico está listo para ayudarte con cualquier integración o problema.
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-2">Planes empresariales</h4>
                    <p className="text-sm text-muted-foreground">
                      ¿Necesitas una solución a medida? Hablemos sobre planes personalizados para tu empresa.
                    </p>
                  </div>
                  
                  <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-2">Asociaciones</h4>
                    <p className="text-sm text-muted-foreground">
                      Exploremos oportunidades de colaboración y asociación estratégica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map or CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
              ¿Prefieres empezar ya?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Crea tu cuenta gratis y comienza a cobrar en minutos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Comenzar Gratis
              </Button>
              <Button variant="outline" size="lg">
                Ver Precios
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactInfoCard({ info, index }: { info: typeof contactInfo[0], index: number }) {
  const { ref: cardRef, isInView } = useInView();
  const Icon = info.icon;

  return (
    <div
      ref={cardRef}
      className={`bg-card border border-border/50 rounded-xl p-6 text-center scroll-fade-up ${isInView ? 'in-view' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
      <p className="text-lg font-bold text-primary mb-1">{info.value}</p>
      <p className="text-sm text-muted-foreground">{info.description}</p>
    </div>
  );
}
