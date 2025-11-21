import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home, Mail, CreditCard } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        {/* Success Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-strong">
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
                  Gracias por completar el registro
                </p>
              </div>

              {/* Details */}
              <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID de Registro:</span>
                  <span className="font-mono font-semibold text-foreground">REG-2024-00123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-semibold text-foreground">
                    {new Date().toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="inline-flex items-center gap-1 text-accent font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Verificado
                  </span>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Confirmación Enviada
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hemos enviado un correo electrónico con los detalles de tu registro. 
                      La empresa procesará tu pago según lo acordado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1" asChild>
                  <a href="/my-cards">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Tarjetas
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </a>
                </Button>
                <Button className="flex-1 bg-gradient-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Comprobante
                </Button>
              </div>

              {/* Support */}
              <p className="text-sm text-muted-foreground pt-4">
                ¿Necesitas ayuda? Contacta a{" "}
                <a href="mailto:soporte@empresa.com" className="text-primary hover:underline">
                  soporte@empresa.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">¿Qué sigue?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>Tu tarjeta ha sido registrada de forma segura y encriptada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>La empresa procesará el cargo según el concepto acordado</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>Recibirás notificaciones sobre cualquier transacción realizada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>Puedes solicitar la eliminación de tu tarjeta en cualquier momento</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
