import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Download, Home, Mail, CreditCard, Calendar, DollarSign, Building2, Clock, FileText, Repeat, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type SubscriptionType = "limited-fixed" | "unlimited-fixed" | "unlimited-variable" | "limited-variable";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const subscriptionType = (searchParams.get("type") || "limited-fixed") as SubscriptionType;

  // Mock subscription data based on type
  const getSubscriptionData = (type: SubscriptionType) => {
    const baseData = {
      registrationId: "REG-2024-00123",
      clientEmail: "cliente@ejemplo.com",
      clientName: "Juan Pérez",
      cardLast4: "4242",
    };

    switch (type) {
      case "limited-fixed":
        return {
          ...baseData,
          businessName: "Academia Elite",
          concept: "Curso de Programación - Plan Anual",
          amount: 450000,
          frequency: "monthly",
          durationType: "limited",
          numberOfPayments: 12,
          billingDay: 5,
          nextChargeDate: "2024-04-05",
          subscriptionType: "fixed" as const,
        };
      case "unlimited-fixed":
        return {
          ...baseData,
          businessName: "Gimnasio FitLife",
          concept: "Membresía Premium",
          amount: 350000,
          frequency: "monthly",
          durationType: "unlimited",
          billingDay: 10,
          nextChargeDate: "2024-03-10",
          subscriptionType: "fixed" as const,
        };
      case "unlimited-variable":
        return {
          ...baseData,
          businessName: "Cooperativa de Salud Vida",
          concept: "Seguro Médico con Renovación Automática",
          durationType: "unlimited",
          subscriptionType: "variable" as const,
        };
      case "limited-variable":
        return {
          ...baseData,
          businessName: "Academia Digital Plus",
          concept: "Plan Anual con Descuentos Iniciales",
          amount: 280000,
          frequency: "monthly",
          durationType: "limited",
          numberOfPayments: 12,
          billingDay: 1,
          nextChargeDate: "2024-04-01",
          subscriptionType: "variable" as const,
          firstPaymentAmount: 150000,
          firstPaymentReason: "Promoción de lanzamiento - 46% de descuento",
          promotionalPayments: 3,
        };
    }
  };

  const subscriptionData = getSubscriptionData(subscriptionType);

  const formatCurrency = (amount: number) => {
    return `₲ ${amount.toLocaleString('es-PY')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      weekly: "Semanal",
      biweekly: "Quincenal",
      monthly: "Mensual",
      quarterly: "Trimestral",
      yearly: "Anual"
    };
    return labels[freq] || freq;
  };

  const getSubscriptionTypeLabel = () => {
    switch (subscriptionType) {
      case "limited-fixed":
        return "Limitada - Monto Fijo";
      case "unlimited-fixed":
        return "Ilimitada - Monto Fijo";
      case "unlimited-variable":
        return "Ilimitada - Monto Variable";
      case "limited-variable":
        return "Limitada - Monto Variable";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Success Card */}
        <Card className="border-2 border-accent/20 bg-card backdrop-blur-sm shadow-strong">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full animate-scale-in">
                <CheckCircle2 className="h-12 w-12 text-accent" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  ¡Tarjeta Registrada Exitosamente!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Tu suscripción ha sido activada
                </p>
              </div>

              {/* Registration Details */}
              <div className="bg-muted/30 border border-border rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID de Registro:</span>
                  <span className="font-mono font-semibold text-foreground">{subscriptionData.registrationId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-semibold text-foreground">
                    {new Date().toLocaleDateString('es-PY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-border" asChild>
                  <a href="/my-cards">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Tarjetas
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 border-border" asChild>
                  <a href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </a>
                </Button>
                <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Comprobante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card className="border-border bg-card backdrop-blur-sm shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Detalles de la Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm">
                {getSubscriptionTypeLabel()}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                    <p className="text-base font-semibold text-foreground">{subscriptionData.businessName}</p>
                  </div>
                </div>
                
                {/* Amount - variable según tipo */}
                {subscriptionData.subscriptionType !== "variable" || subscriptionType === "limited-variable" ? (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="text-sm font-medium text-muted-foreground">
                        {subscriptionType === "limited-variable" && "firstPaymentAmount" in subscriptionData
                          ? "Monto Regular"
                          : "Monto"}
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {"amount" in subscriptionData && formatCurrency(subscriptionData.amount)}
                      </p>
                      
                      {/* Promotional Amount for limited-variable */}
                      {subscriptionType === "limited-variable" && "firstPaymentAmount" in subscriptionData && (
                        <div className="mt-2 p-2 bg-accent/10 border border-accent/30 rounded">
                          <p className="text-xs text-muted-foreground">Precio Promocional</p>
                          <p className="text-sm font-semibold text-accent">
                            {formatCurrency(subscriptionData.firstPaymentAmount)}
                          </p>
                          <p className="text-xs text-accent/90 mt-1">
                            {"promotionalPayments" in subscriptionData 
                              ? `Primeras ${subscriptionData.promotionalPayments} cuotas`
                              : "Primera cuota"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monto Variable</p>
                      <p className="text-sm text-foreground">Según consumo</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Se te notificará antes de cada cobro
                      </p>
                    </div>
                  </div>
                )}
                
                {"frequency" in subscriptionData && (
                  <div className="flex items-start gap-3">
                    <Repeat className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Frecuencia</p>
                      <p className="text-base font-semibold text-foreground">{getFrequencyLabel(subscriptionData.frequency)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {"billingDay" in subscriptionData && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Día de Cobro</p>
                      <p className="text-base font-semibold text-foreground">Día {subscriptionData.billingDay} de cada mes</p>
                    </div>
                  </div>
                )}
                
                {"nextChargeDate" in subscriptionData && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Próximo Cargo</p>
                      <p className="text-base font-semibold text-foreground">{formatDate(subscriptionData.nextChargeDate)}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tarjeta Registrada</p>
                    <p className="text-base font-semibold text-foreground">**** **** **** {subscriptionData.cardLast4}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration info */}
            {subscriptionData.durationType === "limited" && "numberOfPayments" in subscriptionData && (
              <>
                <Separator className="bg-border" />
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground">
                    Duración: {subscriptionData.numberOfPayments} pagos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta suscripción finalizará automáticamente después de completar todos los pagos.
                  </p>
                </div>
              </>
            )}

            <Separator className="bg-border" />

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Confirmación Enviada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un correo a <span className="font-semibold text-foreground">{subscriptionData.clientEmail}</span> con todos los detalles de tu suscripción.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Template Preview */}
        <Card className="border-border bg-card backdrop-blur-sm shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Vista Previa del Correo de Confirmación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 border-2 border-border rounded-lg p-6 md:p-8 space-y-6">
              {/* Email Header */}
              <div className="text-center space-y-2 pb-4 border-b border-border">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-2">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">¡Registro Exitoso!</h2>
                <p className="text-sm text-muted-foreground">Tu suscripción ha sido activada correctamente</p>
              </div>

              {/* Email Body */}
              <div className="space-y-4">
                <p className="text-foreground">
                  Hola <strong>{subscriptionData.clientName}</strong>,
                </p>
                <p className="text-muted-foreground">
                  Gracias por registrar tu tarjeta para la suscripción <strong className="text-foreground">{subscriptionData.concept}</strong> con {subscriptionData.businessName}.
                </p>
                
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">Resumen de tu Suscripción:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium text-foreground">{getSubscriptionTypeLabel()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Concepto:</span>
                      <span className="font-medium text-foreground">{subscriptionData.concept}</span>
                    </div>
                    
                    {/* Conditional fields based on subscription type */}
                    {subscriptionType === "unlimited-variable" ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monto:</span>
                          <span className="font-medium text-foreground">Variable según consumo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duración:</span>
                          <span className="font-medium text-foreground">Renovación automática</span>
                        </div>
                      </>
                    ) : subscriptionType === "limited-variable" && "firstPaymentAmount" in subscriptionData ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Precio Promocional:</span>
                          <span className="font-medium text-accent">{formatCurrency(subscriptionData.firstPaymentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cuotas promocionales:</span>
                          <span className="font-medium text-foreground">
                            {"promotionalPayments" in subscriptionData 
                              ? `${subscriptionData.promotionalPayments} cuotas`
                              : "1 cuota"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Precio Regular:</span>
                          <span className="font-medium text-foreground">{formatCurrency(subscriptionData.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total de pagos:</span>
                          <span className="font-medium text-foreground">{subscriptionData.numberOfPayments}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {"amount" in subscriptionData && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monto:</span>
                            <span className="font-medium text-foreground">{formatCurrency(subscriptionData.amount)}</span>
                          </div>
                        )}
                        {"frequency" in subscriptionData && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Frecuencia:</span>
                            <span className="font-medium text-foreground">{getFrequencyLabel(subscriptionData.frequency)}</span>
                          </div>
                        )}
                        {subscriptionData.durationType === "limited" && "numberOfPayments" in subscriptionData && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Número de pagos:</span>
                            <span className="font-medium text-foreground">{subscriptionData.numberOfPayments}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {"nextChargeDate" in subscriptionData && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Próximo cargo:</span>
                        <span className="font-medium text-foreground">{formatDate(subscriptionData.nextChargeDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarjeta:</span>
                      <span className="font-medium text-foreground">**** {subscriptionData.cardLast4}</span>
                    </div>
                  </div>
                </div>

                {/* Type-specific information */}
                <p className="text-muted-foreground text-sm">
                  {subscriptionType === "unlimited-variable" && (
                    "Recibirás una notificación después de cada cargo con el monto cobrado. Esta suscripción continúa hasta que decidas cancelarla."
                  )}
                  {subscriptionType === "limited-variable" && "firstPaymentAmount" in subscriptionData && (
                    `Disfrutarás de un precio especial durante las primeras ${"promotionalPayments" in subscriptionData ? subscriptionData.promotionalPayments : 1} cuotas. Después, se aplicará el precio regular. Esta suscripción finalizará automáticamente después de ${("numberOfPayments" in subscriptionData && subscriptionData.numberOfPayments) || 0} pagos.`
                  )}
                  {subscriptionType === "unlimited-fixed" && (
                    "Recibirás una notificación antes de cada cargo. Esta suscripción continúa hasta que decidas cancelarla."
                  )}
                  {subscriptionType === "limited-fixed" && (
                    `Esta suscripción finalizará automáticamente después de ${("numberOfPayments" in subscriptionData && subscriptionData.numberOfPayments) || 0} pagos. Recibirás una notificación antes de cada cargo.`
                  )}
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded p-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                </div>
              </div>

              {/* Email Footer */}
              <div className="pt-4 border-t border-border text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Este es un correo automático, por favor no respondas a este mensaje.
                </p>
                <p className="text-xs text-muted-foreground">
                  © 2024 {subscriptionData.businessName}. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-border bg-card backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              ¿Qué sigue?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                <span>Tu tarjeta ha sido registrada de forma segura y encriptada en nuestro sistema</span>
              </li>
              {subscriptionType === "unlimited-variable" ? (
                <>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>Los cargos se realizarán según tu consumo y las condiciones contractuales establecidas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>Recibirás una notificación después de cada transacción con el monto cobrado</span>
                  </li>
                </>
              ) : (
                <>
                  {"nextChargeDate" in subscriptionData && (
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                      <span>El próximo cargo se realizará el {formatDate(subscriptionData.nextChargeDate)}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>Recibirás una notificación por correo antes de cada transacción</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                <span>Puedes gestionar o cancelar tu suscripción en cualquier momento desde tu panel de control</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                <span>Para soporte, contacta a <a href="mailto:soporte@empresa.com" className="text-primary hover:underline font-medium">soporte@empresa.com</a></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* View Other Examples */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Ver Ejemplos de Otros Tipos de Suscripción</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                className={subscriptionType === "limited-fixed" ? "border-primary bg-primary/10" : ""}
                asChild
              >
                <a href="/payment-success?type=limited-fixed">
                  Limitada - Fijo
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={subscriptionType === "unlimited-fixed" ? "border-primary bg-primary/10" : ""}
                asChild
              >
                <a href="/payment-success?type=unlimited-fixed">
                  Ilimitada - Fijo
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={subscriptionType === "unlimited-variable" ? "border-primary bg-primary/10" : ""}
                asChild
              >
                <a href="/payment-success?type=unlimited-variable">
                  Ilimitada - Variable
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={subscriptionType === "limited-variable" ? "border-primary bg-primary/10" : ""}
                asChild
              >
                <a href="/payment-success?type=limited-variable">
                  Limitada - Variable
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
