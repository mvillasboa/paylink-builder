import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  Infinity, 
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const subscriptionTypes = [
  {
    id: 1,
    anchor: "limited-fixed",
    title: "Suscripción Limitada - Monto Fijo",
    description: "Ideal para planes de pago con cuotas definidas y monto constante",
    durationType: "limited",
    amountType: "fixed",
    icon: Calendar,
    iconColor: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    bgColorDark: "dark:from-blue-950/30 dark:to-blue-900/20",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
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
    anchor: "unlimited-fixed",
    title: "Suscripción Ilimitada - Monto Fijo",
    description: "Suscripciones continuas con precio constante hasta cancelación",
    durationType: "unlimited",
    amountType: "fixed",
    icon: Infinity,
    iconColor: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
    bgColorDark: "dark:from-emerald-950/30 dark:to-emerald-900/20",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    examples: [
      "Servicios con reconfirmación previa de tarifas",
      "Membresías con acuerdo contractual",
      "Seguros con renovación acordada",
    ],
    features: [
      "Sin fecha de finalización",
      "Precio constante",
      "Cobro automático periódico",
      "Cancelable en cualquier momento",
    ],
    link: "/pay-unlimited-fixed/demo-004",
    available: true,
  },
  {
    id: 3,
    anchor: "unlimited-variable",
    title: "Suscripción Ilimitada - Monto Variable",
    description: "Perfecta para servicios con precios ajustables sin fecha de finalización",
    durationType: "unlimited",
    amountType: "variable",
    icon: TrendingUp,
    iconColor: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    bgColorDark: "dark:from-orange-950/30 dark:to-orange-900/20",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    examples: [
      "Servicios cooperativos",
      "Servicios de pago por consumo",
      "Seguro médico con renovación automática",
    ],
    features: [
      "Sin límite de tiempo",
      "Monto según condiciones",
      "Cobro periódico automático",
      "Sujeto a condiciones contractuales",
    ],
    link: "/pay-variable-example/demo-002",
    available: true,
  },
  {
    id: 4,
    anchor: "limited-variable",
    title: "Suscripción Limitada - Monto Variable",
    description: "Para servicios temporales con precios ajustables según condiciones",
    durationType: "limited",
    amountType: "variable",
    icon: Clock,
    iconColor: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    bgColorDark: "dark:from-purple-950/30 dark:to-purple-900/20",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    examples: [
      "Planes con descuentos en primeros pagos",
      "Promociones con precios diferenciados",
      "Servicios con bonificaciones iniciales",
    ],
    features: [
      "Duración definida",
      "Precio ajustable",
      "Modificación sujeta a condiciones",
      "Número de pagos establecido",
    ],
    link: "/pay-limited-variable/demo-003",
    available: true,
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
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 backdrop-blur rounded-full border border-primary/20">
            <span className="text-sm font-medium text-primary-foreground">
              Guía de Suscripciones
            </span>
          </div>
          <h1 className="text-5xl font-bold text-primary-foreground mb-4 bg-gradient-to-r from-primary-foreground to-primary-foreground/70 bg-clip-text text-transparent">
            Tipos de Suscripción
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Explora los diferentes tipos de suscripciones disponibles en Paylink y encuentra la que mejor se adapte a tu modelo de negocio
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {subscriptionTypes.map((sub, index) => {
            const Icon = sub.icon;
            return (
              <Card 
                key={sub.id}
                id={sub.anchor}
                className={`relative overflow-hidden border-2 ${sub.borderColor} ${sub.bgColor} ${sub.bgColorDark} backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-slide-up group scroll-mt-24`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Decorative gradient overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${sub.bgColor}`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${sub.bgColor} ${sub.bgColorDark} rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${sub.iconColor}`} />
                    </div>
                    {!sub.available && (
                      <Badge variant="secondary" className="gap-1 shadow-sm">
                        <AlertCircle className="h-3 w-3" />
                        Próximamente
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl mb-3 font-bold">{sub.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{sub.description}</CardDescription>
                  
                  <div className="flex gap-2 mt-5">
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
                          className={`text-xs ${sub.badgeColor} hover:shadow-sm transition-shadow`}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Información adicional */}
        <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8">
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertCircle className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  ¿Necesitas ayuda para elegir el tipo de suscripción?
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Cada tipo de suscripción está diseñado para diferentes modelos de negocio. 
                    Las suscripciones de <strong className="text-foreground">monto fijo</strong> son ideales cuando conoces el precio exacto por adelantado, 
                    mientras que las de <strong className="text-foreground">monto variable</strong> se adaptan a servicios con precios basados en condiciones contractuales.
                  </p>
                  <p>
                    Las suscripciones de <strong className="text-foreground">plazo limitado</strong> tienen una fecha de finalización definida, 
                    perfectas para planes de pago o membresías temporales. Las de <strong className="text-foreground">plazo ilimitado</strong> continúan 
                    hasta que el cliente decide cancelar, ideal para servicios continuos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de regreso */}
        <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/">
            <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
