import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  Infinity, 
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const subscriptionTypes = [
  {
    id: 1,
    title: "Suscripción Limitada - Monto Fijo",
    description: "Ideal para planes de pago con cuotas definidas y monto constante",
    durationType: "limited",
    amountType: "fixed",
    icon: Calendar,
    iconColor: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    examples: [
      "Plan de celular con 12 cuotas fijas",
      "Membresía de gimnasio por 6 meses",
      "Curso online con 10 pagos mensuales",
    ],
    features: [
      "Cantidad de cuotas definida",
      "Monto fijo por período",
      "Fecha de finalización conocida",
      "Monto total calculable",
    ],
    link: "/pay/demo-001",
    available: true,
  },
  {
    id: 2,
    title: "Suscripción Ilimitada - Monto Variable",
    description: "Perfecta para servicios con consumo variable sin fecha de finalización",
    durationType: "unlimited",
    amountType: "variable",
    icon: TrendingUp,
    iconColor: "text-accent",
    bgColor: "bg-accent/5",
    borderColor: "border-accent/20",
    examples: [
      "Servicio de electricidad",
      "Agua potable",
      "Plan de internet por uso",
    ],
    features: [
      "Sin límite de tiempo",
      "Monto según consumo",
      "Cobro periódico automático",
      "Sujeto a condiciones contractuales",
    ],
    link: "/pay-variable-example/demo-002",
    available: true,
  },
  {
    id: 3,
    title: "Suscripción Limitada - Monto Variable",
    description: "Para servicios temporales con precios ajustables según condiciones",
    durationType: "limited",
    amountType: "variable",
    icon: Clock,
    iconColor: "text-secondary",
    bgColor: "bg-secondary/5",
    borderColor: "border-secondary/20",
    examples: [
      "Plan fitness con ajuste de precio",
      "Servicio premium con descuentos progresivos",
      "Suscripción promocional limitada",
    ],
    features: [
      "Duración definida",
      "Precio ajustable",
      "Modificación sujeta a condiciones",
      "Número de pagos establecido",
    ],
    link: null,
    available: false,
  },
  {
    id: 4,
    title: "Suscripción Ilimitada - Monto Fijo",
    description: "Suscripciones continuas con precio constante hasta cancelación",
    durationType: "unlimited",
    amountType: "fixed",
    icon: Infinity,
    iconColor: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    examples: [
      "Netflix, Spotify, etc.",
      "Seguro mensual",
      "Membresía club social",
    ],
    features: [
      "Sin fecha de finalización",
      "Precio constante",
      "Cobro automático periódico",
      "Cancelable en cualquier momento",
    ],
    link: null,
    available: false,
  },
];

export default function SubscriptionExamples() {
  const getDurationBadge = (type: string) => {
    return type === "limited" ? (
      <Badge variant="outline" className="gap-1">
        <Calendar className="h-3 w-3" />
        Plazo Limitado
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <Infinity className="h-3 w-3" />
        Plazo Ilimitado
      </Badge>
    );
  };

  const getAmountBadge = (type: string) => {
    return type === "fixed" ? (
      <Badge variant="outline" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Monto Fijo
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <TrendingUp className="h-3 w-3" />
        Monto Variable
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Tipos de Suscripción
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Explora los diferentes tipos de suscripciones disponibles en Paylink
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {subscriptionTypes.map((sub, index) => {
            const Icon = sub.icon;
            return (
              <Card 
                key={sub.id} 
                className={`border-2 ${sub.borderColor} ${sub.bgColor} backdrop-blur hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 ${sub.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${sub.iconColor}`} />
                    </div>
                    {!sub.available && (
                      <Badge variant="secondary" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Próximamente
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{sub.title}</CardTitle>
                  <CardDescription className="text-base">{sub.description}</CardDescription>
                  
                  <div className="flex gap-2 mt-4">
                    {getDurationBadge(sub.durationType)}
                    {getAmountBadge(sub.amountType)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Características */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Características principales:
                    </h4>
                    <ul className="space-y-2">
                      {sub.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ejemplos */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Casos de uso:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sub.examples.map((example, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Botón */}
                  {sub.available ? (
                    <Link to={sub.link || "#"}>
                      <Button className="w-full group" variant="default">
                        Ver Ejemplo
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Ejemplo en Desarrollo
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Información adicional */}
        <Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  ¿Necesitas ayuda para elegir el tipo de suscripción?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cada tipo de suscripción está diseñado para diferentes modelos de negocio. 
                  Las suscripciones de <strong>monto fijo</strong> son ideales cuando conoces el precio exacto por adelantado, 
                  mientras que las de <strong>monto variable</strong> se adaptan a servicios con precios basados en consumo o condiciones contractuales.
                </p>
                <p className="text-sm text-muted-foreground">
                  Las suscripciones de <strong>plazo limitado</strong> tienen una fecha de finalización definida, 
                  perfectas para planes de pago o membresías temporales. Las de <strong>plazo ilimitado</strong> continúan 
                  hasta que el cliente decide cancelar, ideal para servicios continuos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de regreso */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/">
            <Button variant="outline" size="lg">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
