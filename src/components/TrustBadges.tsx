import { Shield, Award, Lock, Clock } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "PCI DSS Nivel 1",
    description: "Máxima certificación de seguridad",
  },
  {
    icon: Lock,
    title: "Encriptación AES-256",
    description: "Protección de grado militar",
  },
  {
    icon: Clock,
    title: "Disponibilidad 99.99%",
    description: "Siempre disponible para ti",
  },
  {
    icon: Award,
    title: "Soporte 24/7",
    description: "Asistencia cuando la necesites",
  },
];

export const TrustBadges = () => {
  return (
    <section className="py-20 bg-primary/5 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">{badge.title}</h4>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
